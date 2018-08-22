const _ = require('lodash')
const api = require('catalogue-api')
const app = require('express').Router()
const csrfProtection = require('csurf')()
const uuidGenerator = require('node-uuid-generator')
const { check, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const { formatting } = require('catalogue-utils')

const multipartBodyParser = require('express-fileupload')

const {
  enrichContextForProductPage,
  enrichContextForProductPagePreview
} = require('./supplier/product-page')

const primaryContactTypes = [
  'Lead Contact', 'Clinical Safety Officer'
]

const primaryContactHelp = {
  'Lead Contact': 'The person responsible for ensuring the information supplied during onboarding is a true reflection of the solution.',
  'Clinical Safety Officer': 'The person in a Supplier’s organisation responsible for ensuring the safety of a Health IT System in that organisation through the application of clinical risk management.'
}

app.get('/', (req, res) => {
  const context = {
    breadcrumbs: [
      { label: 'My Dashboard' }
    ]
  }

  res.render('supplier/dashboard', context)
})

app.get('/solutions', async (req, res) => {
  delete req.session.solutionEx
  const context = {
    breadcrumbs: [
      { label: 'My Dashboard', url: '/suppliers' },
      { label: 'My Solutions' }
    ],
    created: 'created' in req.query,
    errors: {},
    addSolutionUrl: `${req.baseUrl}/solutions/add`
  }
  let solutions = []

  try {
    // computing the correct status for each solution requires the full SolutionEx
    // structure, so load all of them
    solutions = await Promise.all(
      (await api.get_solutions_for_user(req.user)).map(
        soln => api.get_solution_by_id(soln.id)
      )
    )
  } catch (err) {
    if (err.status === 404) {
      solutions = []
    } else {
      context.errors.general = err
    }
  }

  function solutionDashboardStatus (solutionEx) {
    // by default the status will be the display representation of the base solution
    // status
    const solnStatus = solutionEx.solution.status
    let computedStatus = api.solutionStatuses[solnStatus] || 'Unknown'

    const hasFailedCapAss = _.some(
      solutionEx.claimedCapability,
      ['status', api.CAPABILITY_STATUS.REJECTED]
    )
    const hasRemediationCapAss = _.some(
      solutionEx.claimedCapability,
      ['status', api.CAPABILITY_STATUS.REMEDIATION]
    )

    const decodedStandards = _.map(
      solutionEx.claimedStandard,
      std => ({
        ...std,
        evidence: std.evidence && JSON.parse(std.evidence)
      })
    )

    const hasSubmittedStd = _.some(decodedStandards, 'evidence.submissions.length')

    const productPageStatus = solutionEx.solution.productPage.status

    switch (solnStatus) {
      case api.SOLUTION_STATUS.DRAFT:
        if (hasFailedCapAss) computedStatus = 'Assessment Failed'
        break
      case api.SOLUTION_STATUS.REGISTERED:
        break
      case api.SOLUTION_STATUS.CAPABILITIES_ASSESSMENT:
        computedStatus = 'Submitted for Assessment'
        if (hasRemediationCapAss) computedStatus = 'Assessment Remediation'
        if (hasFailedCapAss) computedStatus = 'Assessment Failed'
        break
      case api.SOLUTION_STATUS.STANDARDS_COMPLIANCE:
        computedStatus = 'Assessed Pending Compliance'
        if (hasSubmittedStd) computedStatus = 'Submitted for Compliance'
        break
      case api.SOLUTION_STATUS.SOLUTION_PAGE:
        switch (productPageStatus) {
          case 'SUBMITTED':
            computedStatus = 'Page Submitted For Moderation'
            break
          case 'REMEDIATION':
            computedStatus = 'Page in Remediation'
            break
          default:
            computedStatus = 'Approved'
        }
        break
      case api.SOLUTION_STATUS.APPROVED:
        computedStatus = 'Page Approved'
        if (productPageStatus === 'PUBLISH') computedStatus = 'Approved, Accepting Sales'
        break
    }

    return computedStatus
  }

  function solutionDashboardContext (solutionEx) {
    const solution = solutionEx.solution

    return {
      ...solution,
      computedStatus: solutionDashboardStatus(solutionEx),
      continueUrl: solution.status === api.SOLUTION_STATUS.APPROVED
                   ? `${req.baseUrl}/solutions/${solution.id}/product-page/preview`
                   : `${req.baseUrl}/solutions/${solution.id}`
    }
  }

  function solutionDashboardGroup (solution) {
    return solution.status === api.SOLUTION_STATUS.APPROVED
           ? 'Live Solutions'
           : 'Onboarding in Progress'
  }

  context.groupedSolutions = _(solutions)
    .map(solutionDashboardContext)
    .groupBy(solutionDashboardGroup)
    .value()

  res.render('supplier/solutions', context)
})

app.get('/solutions/add', csrfProtection, async (req, res) => {
  res.render('supplier/add-solution', {
    breadcrumbs: [
      { label: 'My Dashboard', url: '/suppliers' },
      { label: 'My Solutions', url: '/suppliers/solutions' },
      { label: 'Onboarding Solution', url: `/suppliers/solutions/new` },
      { label: 'Registration' }
    ],
    primaryContactTypes,
    primaryContactHelp,
    csrfToken: req.csrfToken()
  })
})

function addError (errors, fieldName, message) {
  return _.update(errors, fieldName, errs => (errs || []).concat(message))
}

function validateSolution (req) {
  const errors = {}

  let {
    name,
    version,
    description,
    contacts = {},
    secondaryContacts = {}
  } = req.body

  // validate each field
  name = (name || '').trim()
  if (!name.length) addError(errors, 'name', 'Solution name is required')
  if (name.length > 60) addError(errors, 'name', `Solution name is limited to 60 characters, ${name.length} entered`)

  version = (version || '').trim()
  if (version.length > 10) addError(errors, 'version', `Solution version is limited to 10 characters, ${version.length} entered`)

  description = (description || '').trim()
  if (!description.length) addError(errors, 'description', 'Solution description is required')
  if (description.length > 1000) addError(errors, 'description', `Solution description is limited to 1000 characters, ${description.length} entered`)

  // validate the primary contacts, if any part is provided for one, all parts
  // must be provided
  for (const contactType of primaryContactTypes) {
    let {firstName, lastName, emailAddress, phoneNumber} = contacts[contactType] || {}

    firstName = (firstName || '').trim()
    lastName = (lastName || '').trim()
    emailAddress = (emailAddress || '').trim()
    phoneNumber = (phoneNumber || '').trim()

    if (firstName || lastName || emailAddress || phoneNumber || contactType === 'Lead Contact') {
      if (!firstName.length) addError(errors, ['contacts', contactType, 'firstName'], 'First name is required')
      if (firstName.length > 60) addError(errors, ['contacts', contactType, 'firstName'], `First name is limited to 60 characters, ${firstName.length} entered`)

      if (!lastName.length) addError(errors, ['contacts', contactType, 'lastName'], 'Last name is required')
      if (lastName.length > 60) addError(errors, ['contacts', contactType, 'lastName'], `Last name is limited to 60 characters, ${lastName.length} entered`)

      if (!emailAddress.length) addError(errors, ['contacts', contactType, 'emailAddress'], 'Email is required')
      if (emailAddress.length > 120) addError(errors, ['contacts', contactType, 'emailAddress'], `Email is limited to 60 characters, ${emailAddress.length} entered`)

      if (!phoneNumber.length) addError(errors, ['contacts', contactType, 'phoneNumber'], 'Phone number is required')
      if (phoneNumber.length > 30) addError(errors, ['contacts', contactType, 'phoneNumber'], `Phone number is limited to 30 characters, ${phoneNumber.length} entered`)
    } else {
      delete contacts[contactType]
    }
  }

  // convert incoming secondary contacts from an object of arrays into an array of object
  const keys = ['contactType', 'firstName', 'lastName', 'emailAddress', 'phoneNumber']
  secondaryContacts = _.mapValues(secondaryContacts, _.castArray)

  secondaryContacts = secondaryContacts.contactType && secondaryContacts.contactType.length
    ? _.range(secondaryContacts.contactType.length).map(index => _.zipObject(
        keys, _.map(keys, k => secondaryContacts[k][index])
      ))
    : []

  // filter out completely empty secondary contacts, validate the remainder
  secondaryContacts = _.filter(secondaryContacts, contact => {
    let {contactType, firstName, lastName, emailAddress, phoneNumber} = contact

    contactType = (contactType || '').trim()
    firstName = (firstName || '').trim()
    lastName = (lastName || '').trim()
    emailAddress = (emailAddress || '').trim()
    phoneNumber = (phoneNumber || '').trim()

    return contactType || firstName || lastName || emailAddress || phoneNumber
  })

  _.each(secondaryContacts, (contact, index) => {
    let {contactType, firstName, lastName, emailAddress, phoneNumber} = contact

    contactType = (contactType || '').trim()
    firstName = (firstName || '').trim()
    lastName = (lastName || '').trim()
    emailAddress = (emailAddress || '').trim()
    phoneNumber = (phoneNumber || '').trim()

    if (contactType || firstName || lastName || emailAddress || phoneNumber) {
      if (!contactType.length) addError(errors, ['secondaryContacts', index, 'contactType'], 'Contact type is required')
      if (contactType.length > 60) addError(errors, ['secondaryContacts', index, 'contactType'], `Contact type is limited to 60 characters, ${contactType.length} entered`)

      if (!firstName.length) addError(errors, ['secondaryContacts', index, 'firstName'], 'First name is required')
      if (firstName.length > 60) addError(errors, ['secondaryContacts', index, 'firstName'], `First name is limited to 60 characters, ${firstName.length} entered`)

      if (!lastName.length) addError(errors, ['secondaryContacts', index, 'lastName'], 'Last name is required')
      if (lastName.length > 60) addError(errors, ['secondaryContacts', index, 'lastName'], `Last name is limited to 60 characters, ${lastName.length} entered`)

      if (!emailAddress.length) addError(errors, ['secondaryContacts', index, 'emailAddress'], 'Email is required')
      if (emailAddress.length > 120) addError(errors, ['secondaryContacts', index, 'emailAddress'], `Email is limited to 60 characters, ${emailAddress.length} entered`)

      if (!phoneNumber.length) addError(errors, ['secondaryContacts', index, 'phoneNumber'], 'Phone number is required')
      if (phoneNumber.length > 30) addError(errors, ['secondaryContacts', index, 'phoneNumber'], `Phone number is limited to 30 characters, ${phoneNumber.length} entered`)
    }
  })

  let solution = {
    name,
    version,
    description
  }

  return {errors, solution, contacts, secondaryContacts}
}

app.post('/solutions/add', csrfProtection, (req, res) => {
  const {
    errors, solution, contacts, secondaryContacts
  } = validateSolution(req)

  const saveSolution = Object.keys(errors).length
    ? () => Promise.reject(errors)
    : () => {
      return api.create_solution_for_user(solution, req.user)
        .then(newSolution => {
          const solutionEx = {
            solution: newSolution,
            claimedCapability: [],
            claimedStandard: [],
            technicalContact: _.concat(
              _.zipWith(
                _.keys(contacts),
                _.values(contacts),
                (contactType, contact) => {
                  contact.contactType = contactType
                  return contact
                }
              ),
              secondaryContacts
            )
          }
          return api.update_solution(solutionEx)
            .then(() => solutionEx)
        })
        .then(solutionEx => {
          res.redirect(
            req.body.action === 'continue'
            ? `${req.baseUrl}/solutions/${solutionEx.solution.id}/capabilities`
            : `${req.baseUrl}/solutions?created=${solutionEx.solution.id}`
          )
        })
        .catch(err => {
          addError(errors, 'general', err)
          return Promise.reject(errors)
        })
    }

  const rerender = () => {
    const context = {
      ...solution,
      breadcrumbs: [
        { label: 'My Dashboard', url: '/suppliers' },
        { label: 'My Solutions', url: '/suppliers/solutions' },
        { label: 'Onboarding Solution', url: `/suppliers/solutions/new` },
        { label: 'Registration' }
      ],
      primaryContactTypes,
      primaryContactHelp,
      primaryContacts: contacts,
      secondaryContacts,
      errors,
      csrfToken: req.csrfToken()
    }

    res.render('supplier/add-solution', context)
  }

  saveSolution().catch(rerender)
})

async function loadSolutionDetails (solutionId) {
  const { capabilities: allCaps, standards: allStds } = await api.get_all_capabilities()

  const allCapabilities = _.keyBy(allCaps, 'id')
  const allStandards = _.keyBy(allStds, 'id')

  const solutionEx = await api.get_solution_by_id(solutionId)

  solutionEx.solution.capabilities = _.sortBy(_.map(solutionEx.claimedCapability, cap => {
    const mainCap = allCapabilities[cap.capabilityId]
    cap.name = _.get(mainCap, 'name')
    cap.optionalStandards = _.map(
      _.filter(solutionEx.claimedCapabilityStandard, ['claimedCapabilityId', cap.id]),
      capStd => _.get(
        _.find(mainCap.standards.optional, ['id', capStd.standardId]),
        'name'
      )
    )
    return cap
  }), 'name')

  solutionEx.solution.standards = _.sortBy(_.map(solutionEx.claimedStandard, std => {
    std.name = _.get(allStandards[std.standardId], 'name')
    return std
  }), 'name')

  solutionEx.solution.contacts = _.map(
    solutionEx.technicalContact, contact => ({
      ...contact,
      phoneNumberUrl: contact.phoneNumber.replace(/ /g, '-')
    })
  )

  return solutionEx.solution
}

app.get('/solutions/:solution_id', async (req, res) => {
  delete req.session.solutionEx

  const defaults = {
    continueUrl: false,
    complete: false,
    stageClass: false
  }

  const context = {
    breadcrumbs: [
      { label: 'My Dashboard', url: '/suppliers' },
      { label: 'My Solutions', url: '/suppliers/solutions' },
      { label: 'Onboarding Solution' }
    ],
    errors: {},
    stages: {
      register: {...defaults},
      assessment: {...defaults},
      compliance: {...defaults},
      solution_page: {...defaults}
    }
  }
  let solution

  try {
    solution = await loadSolutionDetails(req.params.solution_id)

    context.solution = solution

    const status = solution.status
    const solnUrl = `${req.baseUrl}/solutions/${solution.id}`

    // all draft solutions can be submitted for registration
    if (status === api.SOLUTION_STATUS.DRAFT) {
      context.stages.register.continueUrl = `${solnUrl}/edit`
    }

    // all registered solutions, and those already in assessment can access assessment
    if (status === api.SOLUTION_STATUS.REGISTERED ||
        status === api.SOLUTION_STATUS.CAPABILITIES_ASSESSMENT) {
      context.stages.register.complete = true
      context.stages.assessment.continueUrl = `${solnUrl}/assessment`
      context.stages.compliance.viewUrl = `${solnUrl}/compliance`
      context.stages.compliance.stageClass = 'active'
      context.stages.solution_page.viewUrl = `${solnUrl}/product-page`
      context.stages.solution_page.stageClass = 'active'
    }

    // solutions in standards compliance can access compliance
    if (status === api.SOLUTION_STATUS.STANDARDS_COMPLIANCE) {
      context.stages.register.complete = true
      context.stages.assessment.complete = true
      context.stages.compliance.continueUrl = `${solnUrl}/compliance`
      context.stages.solution_page.viewUrl = `${solnUrl}/product-page`
      context.stages.solution_page.stageClass = 'active'
    }

    // solutions in solution page status can edit solution page
    if (status === api.SOLUTION_STATUS.SOLUTION_PAGE) {
      context.stages.register.complete = true
      context.stages.assessment.complete = true
      context.stages.compliance.complete = true
      context.stages.solution_page.continueUrl = `${solnUrl}/product-page`
    }

    // for completeness, handle approved solutions
    if (status === api.SOLUTION_STATUS.APPROVED) {
      context.stages.register.complete = true
      context.stages.assessment.complete = true
      context.stages.compliance.complete = true
      context.stages.solution_page.complete = true
    }
  } catch (err) {
    context.errors.general = err
    context.stages.register.getStartedUrl = `${req.baseUrl}/solutions/add`
  }

  res.render('supplier/onboarding-status', context)
})

app.get('/solutions/:solution_id/edit', csrfProtection, async (req, res) => {
  try {
    const solutionEx = await api.get_solution_by_id(req.params.solution_id)

    // only draft solutions can be edited
    if (solutionEx.solution.status !== api.SOLUTION_STATUS.DRAFT) {
      return res.redirect('/suppliers/solutions')
    }

    // partition contacts by primary/secondary
    const [primaryContacts, secondaryContacts] = _.partition(
      solutionEx.technicalContact,
      contact => _.includes(primaryContactTypes, contact.contactType)
    )

    res.render('supplier/add-solution', {
      ...solutionEx.solution,
      breadcrumbs: [
        { label: 'My Dashboard', url: '/suppliers' },
        { label: 'My Solutions', url: '/suppliers/solutions' },
        { label: 'Onboarding Solution', url: `/suppliers/solutions/${req.params.solution_id}` },
        { label: 'Registration' }
      ],
      primaryContactTypes,
      primaryContactHelp,
      primaryContacts: _.keyBy(primaryContacts, 'contactType'),
      secondaryContacts,
      csrfToken: req.csrfToken()
    })
  } catch (err) {
    throw err
  }
})

app.post('/solutions/:solution_id/edit', csrfProtection, (req, res) => {
  const {
    errors, solution, contacts, secondaryContacts
  } = validateSolution(req)

  const saveSolution = Object.keys(errors).length
    ? () => Promise.reject(errors)
    : () => {
      return api.get_solution_by_id(req.params.solution_id)
        .then(solutionToUpdate => {
          solutionToUpdate.solution = {
            ...solutionToUpdate.solution,
            ...solution
          }

          // TODO not efficient, re-creates all contacts every save
          solutionToUpdate.technicalContact = _.concat(
            _.zipWith(
              _.keys(contacts),
              _.values(contacts),
              (contactType, contact) => {
                contact.contactType = contactType
                return contact
              }
            ),
            secondaryContacts
          )

          return api.update_solution(solutionToUpdate)
            .then(() => solutionToUpdate)
        })
        .then(({solution}) => {
          res.redirect(
            req.body.action === 'continue'
            ? `${req.baseUrl}/solutions/${solution.id}/capabilities`
            : `${req.baseUrl}/solutions`
          )
        })
        .catch(err => {
          addError(errors, 'general', err)
          return Promise.reject(errors)
        })
    }

  const rerender = () => {
    const context = {
      ...solution,
      breadcrumbs: [
        { label: 'My Dashboard', url: '/suppliers' },
        { label: 'My Solutions', url: '/suppliers/solutions' },
        { label: 'Onboarding Solution', url: `/suppliers/solutions/${req.params.solution_id}` },
        { label: 'Registration' }
      ],
      primaryContactTypes,
      primaryContactHelp,
      primaryContacts: contacts,
      secondaryContacts,
      errors,
      csrfToken: req.csrfToken()
    }

    res.render('supplier/add-solution', context)
  }

  saveSolution().catch(rerender)
})

app.get('/solutions/:solution_id/capabilities', csrfProtection, async (req, res) => {
  const [solutionEx, { capabilities, groupedStandards }] = await Promise.all([
    api.get_solution_by_id(req.params.solution_id),
    api.get_all_capabilities()
  ])

  // only draft solutions can be edited
  if (solutionEx.solution.status !== api.SOLUTION_STATUS.DRAFT) {
    return res.redirect('/suppliers/solutions')
  }

  res.render('supplier/solution-capabilities', {
    ...solutionEx.solution,
    breadcrumbs: [
      { label: 'My Dashboard', url: '/suppliers' },
      { label: 'My Solutions', url: '/suppliers/solutions' },
      { label: 'Onboarding Solution', url: `/suppliers/solutions/${req.params.solution_id}` },
      { label: 'Registration' }
    ],
    capabilities: capabilities.map(cap => {
      const claimedCapability = _.find(solutionEx.claimedCapability, ['capabilityId', cap.id])
      cap.selected = !!claimedCapability
      cap.standardIds = _.map(_.flatMap(cap.standards), 'id')
      cap.optionalStandards = _.map(cap.standards.optional, optStd => ({
        id: optStd.id,
        selected: claimedCapability &&
                  _.some(solutionEx.claimedCapabilityStandard, ['claimedCapabilityId', claimedCapability.id])
      }))
      return cap
    }),
    standards: groupedStandards,
    csrfToken: req.csrfToken()
  })
})

app.post('/solutions/:solution_id/capabilities', csrfProtection, async (req, res) => {
  const [solutionEx, { capabilities, groupedStandards }] = await Promise.all([
    api.get_solution_by_id(req.params.solution_id),
    api.get_all_capabilities()
  ])

  // only draft solutions can be edited
  if (solutionEx.solution.status !== api.SOLUTION_STATUS.DRAFT) {
    return res.redirect('/suppliers/solutions')
  }

  solutionEx.claimedCapability = _.castArray(req.body.capabilities || []).map(id => ({
    id: uuidGenerator.generate(),
    capabilityId: id
  }))

  // claim any optional standards associated with the claimed capabilities
  // (now only used to track which capabilities the standards were selected against)
  solutionEx.claimedCapabilityStandard = []
  solutionEx.claimedCapability.forEach(cap => {
    const optionalStandardId = _.get(req.body.optionalStandards, cap.capabilityId)
    if (optionalStandardId) {
      solutionEx.claimedCapabilityStandard.push({
        claimedCapabilityId: cap.id,
        standardId: optionalStandardId
      })
    }
  })

  // claim all the non-optional standards associated with all the claimed capabilities
  solutionEx.claimedStandard = _.uniqBy(
    _.map(
      _.flatten(
        _.map(
          solutionEx.claimedCapability,
          ({capabilityId}) => _.flatMap(
            _.pick(
              _.get(_.find(capabilities, ['id', capabilityId]), 'standards', {}),
              ['interop', 'mandatory', 'overarching']
            )
          )
        )
      ),
      std => ({standardId: std.id})
    ),
    'standardId'
  )

  // optional standards are now also claimed along with the other standards
  solutionEx.claimedStandard = _.concat(
    solutionEx.claimedStandard,
    _.uniqBy(solutionEx.claimedCapabilityStandard, 'standardId')
  )

  try {
    let redirectUrl = `${req.baseUrl}/solutions`

    if (req.body.action === 'submit') {
      solutionEx.solution.status = api.SOLUTION_STATUS.REGISTERED
      redirectUrl = `${req.baseUrl}/solutions/${solutionEx.solution.id}/submitted`
    }

    await api.update_solution(solutionEx)

    res.redirect(redirectUrl)
  } catch (err) {
    res.render('supplier/solution-capabilities', {
      ...solutionEx.solution,
      breadcrumbs: [
        { label: 'My Dashboard', url: '/suppliers' },
        { label: 'My Solutions', url: '/suppliers/solutions' },
        { label: 'Onboarding Solution', url: `/suppliers/solutions/${req.params.solution_id}` },
        { label: 'Registration' }
      ],
      capabilities: capabilities.map(cap => {
        cap.selected = _.some(solutionEx.claimedCapability, ['capabilityId', cap.id])
        cap.standardIds = _.map(_.flatMap(cap.standards), 'id')
        return cap
      }),
      standards: groupedStandards,
      errors: err,
      csrfToken: req.csrfToken()
    })
  }
})

app.get('/solutions/:solution_id/submitted', async (req, res) => {
  const solutionEx = await api.get_solution_by_id(req.params.solution_id)
  const context = {
    dashboardUrl: `${req.baseUrl}/solutions`,
    solution: solutionEx.solution
  }

  switch (solutionEx.solution.status) {
    case api.SOLUTION_STATUS.REGISTERED:
      context.registered = true
      context.continueUrl = `${req.baseUrl}/solutions/${solutionEx.solution.id}/assessment`
      break

    case api.SOLUTION_STATUS.CAPABILITIES_ASSESSMENT:
      context.assessment = true
      context.continueUrl = `${req.baseUrl}/solutions/${solutionEx.solution.id}/compliance`
      break

    case api.SOLUTION_STATUS.STANDARDS_COMPLIANCE:
      context.compliance = true
      context.standard = req.query.std
      context.continueUrl = `${req.baseUrl}/solutions/${solutionEx.solution.id}/compliance`
      break

    case api.SOLUTION_STATUS.SOLUTION_PAGE:
      context.solution_page = true
  }

  res.render('supplier/solution-submitted', context)
})

function renderProductPageEditor (req, res, solutionEx, context) {
  enrichContextForProductPage(context, solutionEx)
  context.breadcrumbs = [
    { label: 'My Dashboard', url: '/suppliers' },
    { label: 'My Solutions', url: '/suppliers/solutions' },
    { label: 'Onboarding Solution', url: `/suppliers/solutions/${req.params.solution_id}` },
    { label: 'Solution Page' }
  ]
  context.csrfToken = req.csrfToken()
  res.render('supplier/solution-page-edit', context)
}

app.get('/solutions/:solution_id/product-page', csrfProtection, async (req, res) => {
  const context = {
    errors: {}
  }
  let solutionEx

  try {
    // load from session when coming back from preview, if ID is the same
    solutionEx = req.session.solutionEx && req.session.solutionEx.solution.id === req.params.solution_id
               ? req.session.solutionEx
               : await api.get_solution_by_id(req.params.solution_id)
    context.capabilities = _.get(await api.get_all_capabilities(), 'capabilities')
    if (solutionEx.solution.productPage.message) {
      context.message = await formatting.formatMessagesForDisplay([
        _.merge({}, solutionEx.solution.productPage.message)
      ])
    }
    context.organisationName = _.get(await api.get_org_by_id(solutionEx.solution.organisationId), 'name')
    context.allowSubmit = solutionEx.solution.status === api.SOLUTION_STATUS.SOLUTION_PAGE
  } catch (err) {
    context.errors.general = err
  }

  renderProductPageEditor(req, res, solutionEx, context)
})

const validateSolutionName = (fieldName = 'name') =>
  check(fieldName, 'Solution name must be present and has a maximum length of 60 characters')
  .exists()
  .isLength({min: 1, max: 60})
  .trim()

const validateSolutionVersion = (fieldName = 'version') =>
  check(fieldName, 'Solution version has a maximum length of 10 characters')
  .isLength({max: 10})
  .trim()

const validateSolutionDescription = (fieldName = 'description') =>
  check(fieldName, 'Solution description must be present and has a maximum length of 1000 characters')
  .exists()
  .isLength({min: 1, max: 1000})
  .trim()

const validateAbout = (fieldName = 'about') =>
  check(fieldName, 'Company information has a maximum length of 400 characters')
  .isLength({max: 400})
  .trim()

app.post('/solutions/:solution_id/product-page', [
  multipartBodyParser(),
  // middleware to produce a req.body that matches body-parser's extended mode
  (req, res, next) => {
    const qs = require('qs')

    // construct a qs.parse()able string from the body, taking care to present array-valued
    // items as a sequence of multiple values for the same key
    const parsable = _.map(req.body, (v, k) =>
      (Array.isArray(v) ? v : [v]).map(v => k + '=' + encodeURIComponent(v)).join('&')
    ).join('&')
    req.body = qs.parse(parsable)
    next()
  },
  csrfProtection,
  validateSolutionName(),
  validateSolutionVersion(),
  validateSolutionDescription(),
  validateAbout()
], async (req, res) => {
  let redirect = req.originalUrl
  const context = {
    errors: _.mapValues(
      _.groupBy(validationResult(req).array(), 'param'),
      errs => _.map(errs, 'msg')
    )
  }
  let solutionEx

  try {
    solutionEx = await api.get_solution_by_id(req.params.solution_id)
    context.capabilities = _.get(await api.get_all_capabilities(), 'capabilities')
    context.organisationName = _.get(await api.get_org_by_id(solutionEx.solution.organisationId), 'name')
  } catch (err) {
    context.errors.general = err
    return renderProductPageEditor(req, res, solutionEx, context)
  }

  const validated = matchedData(req)
  solutionEx.solution.name = validated.name || req.body.name
  solutionEx.solution.version = validated.version || req.body.version
  solutionEx.solution.description = validated.description || req.body.description

  const updateForProductPage = {
    benefits: _.filter(_.map(_.castArray(req.body.benefits), _.trim)),
    interop: _.filter(_.map(_.castArray(req.body.interop), _.trim)),
    contact: _.pickBy(_.mapValues(req.body.contact, _.trim)),
    capabilities: req.body.capabilities ? _.castArray(req.body.capabilities) : [],
    requirements: _.filter(_.map(_.castArray(req.body.requirements), _.trim)),
    'case-study': _.filter(_.castArray(req.body['case-study']), cs => cs.title),
    optionals: {
      'additional-services': _.mapValues(
        _.pickBy(req.body['additional-services']),
        val => val === 'yes'
      )
    },
    about: validated.about || req.body.about
  }

  // encode the uploaded logo (if any)
  if (req.files.logo) {
    const logo = req.files.logo
    updateForProductPage.logoUrl = `data:${logo.mimetype};base64,${logo.data.toString('base64')}`
  } else if (req.body.preserveLogo && req.session.solutionEx) {
    updateForProductPage.logoUrl = _.get(req.session.solutionEx, 'solution.productPage.logoUrl', '')
  } else if (!req.body.preserveLogo) {
    updateForProductPage.logoUrl = ''
  }

  solutionEx.solution.productPage = _.assign(
    {},
    solutionEx.solution.productPage,
    updateForProductPage
  )

  // if there are validation errors, re-render the editor
  if (!_.isEmpty(context.errors)) {
    return renderProductPageEditor(req, res, solutionEx, context)
  }

  // save, preview or submit based on the action
  const action = _.head(_.keys(req.body.action))
  if (action === 'save' || action === 'submit') {
    try {
      delete req.session.solutionEx

      redirect = `${req.baseUrl}/solutions`

      if (action === 'submit') {
        solutionEx.solution.productPage.status = 'SUBMITTED'
        redirect = `${req.baseUrl}/solutions/${solutionEx.solution.id}/submitted`
      }

      solutionEx = await api.update_solution(solutionEx)
    } catch (err) {
      context.errors.general = err
      return renderProductPageEditor(req, res, solutionEx, context)
    }
  } else if (action === 'preview') {
    req.session.solutionEx = solutionEx
    redirect = `${req.baseUrl}/solutions/${solutionEx.solution.id}/product-page/preview`
  }

  res.redirect(redirect)
})

app.get('/solutions/:solution_id/product-page/preview', csrfProtection, async (req, res) => {
  const context = {
    errors: {}
  }
  let solutionEx = req.session.solutionEx

  try {
    if (!solutionEx) {
      solutionEx = await api.get_solution_by_id(req.params.solution_id)
      req.session.solutionEx = solutionEx
    }
    await enrichContextForProductPagePreview(context, solutionEx)
  } catch (err) {
    context.errors.general = err
  }

  // if the page has not been approved, allow the user to submit for review
  context.allowReview = solutionEx.solution.status === api.SOLUTION_STATUS.SOLUTION_PAGE

  // if the page has been approved, allow the user to publish
  context.allowPublish = solutionEx.solution.status === api.SOLUTION_STATUS.APPROVED &&
                         context.productPage.status === 'APPROVED'

  // flag if the page is published
  context.isPublished = solutionEx.solution.status === api.SOLUTION_STATUS.APPROVED &&
                        context.productPage.status === 'PUBLISH'

  context.editUrl = `${req.baseUrl}/solutions/${solutionEx.solution.id}/product-page`
  context.csrfToken = req.csrfToken()
  res.render('supplier/solution-page-preview', context)
})

app.post('/solutions/:solution_id/product-page/preview', csrfProtection, async (req, res) => {
  const solutionEx = req.session.solutionEx

  const action = _.head(_.keys(req.body.action))
  let redirect = `${req.baseUrl}/solutions`

  if (action === 'review' &&
      solutionEx.solution.status === api.SOLUTION_STATUS.SOLUTION_PAGE) {
    solutionEx.solution.productPage.status = 'SUBMITTED'
    redirect = `${req.baseUrl}/solutions/${solutionEx.solution.id}/submitted`
  } else if (action === 'publish' &&
      solutionEx.solution.status === api.SOLUTION_STATUS.APPROVED) {
    solutionEx.solution.productPage.status = 'PUBLISH'
  }

  req.session.solutionEx = await api.update_solution(solutionEx)
  res.redirect(redirect)
})

app.use('/solutions/:solution_id/assessment', require('./supplier/assessment'))
app.use('/solutions/:solution_id/compliance', require('./supplier/compliance'))

module.exports = app