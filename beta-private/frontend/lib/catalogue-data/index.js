const _ = require('lodash')

const solutionOnboardingStatusMap = {
  '-1': { stageName: 'Failure', status: 'Failed' },
  '0': { stageName: 'Registration', stageStep: '1 of 4', status: 'Draft' },
  '1': { stageName: 'Registration', stageStep: '1 of 4', status: 'Complete' },
  '2': { stageName: 'Assessment', stageStep: '2 of 4', status: 'Submitted' },
  '3': { stageName: 'Compliance', stageStep: '3 of 4', status: 'In progress' },
  '4': { stageName: 'Final Approval', stageStep: '3 of 4', status: 'In progress' },
  '5': { stageName: 'Solution Page', stageStep: '4 of 4', status: 'In progress' }
}

const solutionComplianceStatusMap = {
  '-1': { statusClass: 'failed', statusTransKey: 'Statuses.Standard.Failed' },
  '0': { statusClass: 'not-started', statusTransKey: 'Statuses.Standard.NotStarted' },
  '1': { statusClass: 'draft', statusTransKey: 'Statuses.Standard.Draft' },
  '2': { statusClass: 'submitted', statusTransKey: 'Statuses.Standard.Submitted' },
  '3': { statusClass: 'remediation', statusTransKey: 'Statuses.Standard.Remediation' },
  '4': { statusClass: 'approved', statusTransKey: 'Statuses.Standard.Approved' },
  '5': { statusClass: 'approved first', statusTransKey: 'Statuses.Standard.Approved' },
  '6': { statusClass: 'approved partial', statusTransKey: 'Statuses.Standard.Approved' },
  '7': { statusClass: 'rejected', statusTransKey: 'Statuses.Standard.Rejected' }
}

const EMPTY_UUID = '00000000-0000-0000-0000-000000000000'

// set up the data layer caches
const cacheManager = require('cache-manager')
const cacheStoreParams = process.env.CACHE_HOST
  ? { store: require('cache-manager-redis-store'), host: process.env.CACHE_HOST }
  : { store: 'memory' }

// cache for long-term storage of data that doesn't change regularly (e.g. capability map)
const dataCache = cacheManager.caching({
  ...cacheStoreParams,
  prefix: 'bcbeta-data:',
  ttl: 24 * 60 * 60
})

// cache for short-term storage of session data
const CacheManagerStore = require('express-session-cache-manager').default
const sessionStore = new CacheManagerStore(cacheManager.caching({
  ...cacheStoreParams,
  ttl: 60 * 60
}), {
  prefix: 'bcbeta-sess:'
})

const NHS_DIGITAL_CONTACT = {
  firstName: 'NHS',
  lastName: 'Digital'
}

function contactWithDisplayName (contact) {
  return _.create(contact, {
    displayName: `${contact.firstName} ${contact.lastName}`
  })
}

class DataProvider {
  constructor (CatalogueApi) {
    this.CatalogueApi = CatalogueApi
    this.contactsApi = new this.CatalogueApi.ContactsApi()
    this.orgsApi = new CatalogueApi.OrganisationsApi()
    this.solutionsApi = new CatalogueApi.SolutionsApi()
    this.solutionsExApi = new CatalogueApi.SolutionsExApi()
    this.capabilityMappingsApi = new CatalogueApi.CapabilityMappingsApi()
    this.capabilityEvidenceAPI = new CatalogueApi.CapabilitiesImplementedEvidenceApi()
  }

  async contactById (contactId) {
    return this.contactsApi.apiContactsByIdByIdGet(contactId)
  }

  async contactByEmail (email) {
    const contact = await this.contactsApi.apiContactsByEmailByEmailGet(email)
    if (!contact) throw new Error(`No contact found`)

    const org = await this.orgsApi.apiOrganisationsByContactByContactIdGet(contact.id)
    if (!org) throw new Error(`No organisation found for contact`)

    // identify supplier organisations
    org.isSupplier = org.primaryRoleId === 'RO92'

    return { contact, org }
  }

  async contactsByOrg (orgId) {
    const contacts = await this.contactsApi.apiContactsByOrganisationByOrganisationIdGet(orgId, { pageSize: 9999 })
    return contacts.items
  }

  solutionsByOrganisation (orgId) {
    return this.solutionsExApi.apiPorcelainSolutionsExByOrganisationByOrganisationIdGet(orgId)
  }

  async solutionsForSupplierDashboard (supplierOrgId, solutionMapper = x => x) {
    const isLive = (solnEx) => +solnEx.solution.status === 6 /* Solutions.StatusEnum.Approved */
    const isOnboarding = (solnEx) => +solnEx.solution.status !== 6 /* Solutions.StatusEnum.Approved */

    const forDashboard = (solnEx) => ({
      ...solnEx,
      raw: solnEx.solution,
      id: solnEx.solution.id,
      displayName: `${solnEx.solution.name}${solnEx.solution.version ? ` | ${solnEx.solution.version}` : ''}`,
      notifications: []
    })

    const forOnboarding = (soln) => {
      soln = {
        ...soln,
        ...solutionOnboardingStatusMap[+soln.raw.status]
      }
      return soln
    }

    const forLive = (soln) => ({
      ...soln,
      status: 'Accepting call-offs',
      contractCount: 0
    })

    const hasStartedAssessment = (soln) => {
      if (+soln.raw.status === 1 && soln.claimedCapabilityEvidence.length) {
        return {
          ...soln,
          stageName: 'Assessment',
          stageStep: '2 of 4',
          status: 'Draft'
        }
      } else return soln
    }

    const failureReasons = (soln) => {
      if (+soln.raw.status !== -1 || _.isEmpty(soln)) return { ...soln }
      else if (soln.standards.some((std) => +std.status === -1)) {
        return { ...soln, stageStep: 'Compliance Outcome' }
      } else {
        return { ...soln, stageStep: 'Assessment Outcome' }
      }
    }

    const solutions = await this.solutionsByOrganisation(supplierOrgId)

    const onboardingSolutions = solutions
      .filter(isOnboarding)
      .map(forDashboard)
      .map(forOnboarding)
      .map(hasStartedAssessment)
      .map(failureReasons)

    return {
      onboarding: onboardingSolutions.map(solutionMapper),
      live: solutions.filter(isLive).map(forDashboard).map(forLive).map(solutionMapper)
    }
  }

  async createSolutionForRegistration (solution, user) {
    const payload = {
      solution: {
        ...solution,
        status: 'Draft',
        id: EMPTY_UUID,
        createdById: user.contact.id,
        modifiedById: user.contact.id,
        organisationId: user.org.id
      }
    }

    const newSolution = await this.solutionsApi.apiSolutionsPost(payload)
    return this.solutionForRegistration(newSolution.id)
  }

  async solutionForRegistration (solutionId) {
    const solutionEx = await this.solutionsExApi.apiPorcelainSolutionsExBySolutionBySolutionIdGet(solutionId)
    // reformat the returned value for ease-of-use
    return {
      ...solutionEx.solution,
      capabilities: solutionEx.claimedCapability,
      standards: solutionEx.claimedStandard,
      contacts: _.orderBy(solutionEx.technicalContact, c => {
        // Lead Contact sorts above all others, then alphabetic by type
        return c.contactType === 'Lead Contact' ? '' : c.contactType
      }),
      _raw: solutionEx
    }
  }

  async updateSolutionForRegistration (solution) {
    const solnEx = await this.solutionsExApi.apiPorcelainSolutionsExBySolutionBySolutionIdGet(solution.id)

    // reformat the input back into a SolutionEx
    _.merge(solnEx.solution, _.omit(solution, ['capabilities', 'standards', 'contacts']))
    solnEx.claimedCapability = solution.capabilities

    // for standards with the same ID, preserve the existing claimed standard
    solnEx.claimedStandard = _.map(solution.standards, std => (
      _.find(solnEx.claimedStandard, { standardId: std.standardId }) ||
      { id: require('node-uuid-generator').generate(), ...std }
    ))

    solnEx.technicalContact = solution.contacts

    // contacts can only be for this solution
    // new contacts need a dummy ID
    _.each(solnEx.technicalContact, c => {
      c.solutionId = solnEx.solution.id
      if (!c.id) {
        c.id = require('node-uuid-generator').generate()
      }
    })

    // because the API server doesn't do this for me, implement cascading
    // delete of evidence/reviews for any capabilities and standards that
    // have been removed
    solnEx.claimedCapabilityEvidence = _.filter(solnEx.claimedCapabilityEvidence,
      ev => _.some(solnEx.claimedCapability, { id: ev.claimId })
    )
    solnEx.claimedCapabilityReview = _.filter(solnEx.claimedCapabilityReview,
      rev => _.some(solnEx.claimedCapabilityEvidence, { id: rev.evidenceId })
    )
    solnEx.claimedStandardEvidence = _.filter(solnEx.claimedStandardEvidence,
      ev => _.some(solnEx.claimedStandard, { id: ev.claimId })
    )
    solnEx.claimedStandardReview = _.filter(solnEx.claimedStandardReview,
      rev => _.some(solnEx.claimedStandardEvidence, { id: rev.evidenceId })
    )

    await this.solutionsExApi.apiPorcelainSolutionsExUpdatePut({ solnEx })
    return this.solutionForRegistration(solution.id)
  }

  /**
   * Given a solution (id, organisationId, name and version), check that they are unique
   *
   * Returns true if the supplied details are unique
   */
  async validateSolutionUniqueness (solution) {
    const allSolns = await this.solutionsApi.apiSolutionsByOrganisationByOrganisationIdGet(solution.organisationId, {
      pageSize: 9999
    })

    return _(allSolns.items)
      .filter(soln => !solution.id || soln.id !== solution.id)
      .every(soln => soln.version !== solution.version || soln.name !== solution.name)
  }

  async capabilityMappings () {
    return dataCache.wrap('capabilityMappings', async () => {
      const {
        capabilityMapping,
        standard
      } = await this.capabilityMappingsApi.apiPorcelainCapabilityMappingsGet()

      const standards = _.keyBy(standard, 'id')

      return {
        capabilities: _(capabilityMapping)
          .map(({ capability, optionalStandard }) => {
            const capStds = _.map(optionalStandard, ({ standardId }) => standards[standardId])
            return {
              ...capability,
              standards: capStds,
              standardsByGroup: _.zipObject(
                ['overarching', 'associated'],
                _.partition(capStds, std => std.isOverarching)
              ),
              types: _.kebabCase(capability.name)
            }
          })
          .keyBy('id')
          .value(),
        standards
      }
    })
  }

  async solutionForAssessment (solutionId) {
    const solutionEx = await this.solutionsExApi.apiPorcelainSolutionsExBySolutionBySolutionIdGet(solutionId)
    const { capabilities } = await this.capabilityMappings()

    const solution = {
      ...solutionEx.solution,
      capabilities: solutionEx.claimedCapability,
      evidence: solutionEx.claimedCapabilityEvidence,
      reviews: solutionEx.claimedCapabilityReview,
      standards: solutionEx.claimedStandard,
      contacts: _.orderBy(solutionEx.technicalContact, c => {
        return c.contactType === 'Lead Contact' ? '' : c.contactType
      })
    }

    const capEvidence = _.map(solutionEx.claimedCapabilityEvidence, (evidence) => {
      const id = evidence.id
      return {
        ...evidence,
        messages: solutionEx.claimedCapabilityReview.filter((rev) => rev.evidenceId === id)
      }
    })

    solution.capabilities = _.map(solution.capabilities, (cap) => {
      return {
        ...capabilities[cap.capabilityId],
        claimID: cap.id,
        evidence: capEvidence.filter((evidence) => evidence.claimId === cap.id)
      }
    })

    return solution
  }

  async solutionForCompliance (solutionId) {
    const solution = await this.solutionForRegistration(solutionId)

    solution.candidateOwners = await this.contactsByOrg(solution.organisationId)
    solution.evidence = solution._raw.claimedStandardEvidence
    solution.reviews = solution._raw.claimedStandardReview

    const leadContact = _.find(solution.contacts, { contactType: 'Lead Contact' })
    solution.candidateOwners.unshift({ ...leadContact, id: null })

    // compute status and ownership information for each standard
    solution.standards.forEach(std => {
      const ownerContact = _.find(solution.candidateOwners, { id: std.ownerId }) || leadContact

      _.assign(std, {
        ...solutionComplianceStatusMap[std.status],
        ownerContact: contactWithDisplayName(ownerContact),
        withContact: contactWithDisplayName(+std.status === 2 ? NHS_DIGITAL_CONTACT : ownerContact)
      })
    })

    return solution
  }

  async updateSolutionForCompliance (solution) {
    const solnEx = await this.solutionsExApi.apiPorcelainSolutionsExBySolutionBySolutionIdGet(solution.id)

    solnEx.claimedStandard = _.map(solution.standards,
      std => _.pick(std, ['id', 'status', 'solutionId', 'standardId', 'ownerId'])
    )
    solnEx.claimedStandardEvidence = solution.evidence
    solnEx.claimedStandardReview = solution.reviews

    await this.solutionsExApi.apiPorcelainSolutionsExUpdatePut({ solnEx })
    return this.solutionForCompliance(solution.id)
  }

  async updateSolutionCapabilityEvidence (solutionID, evidence) {
    const solnEx = await this.solutionsExApi.apiPorcelainSolutionsExBySolutionBySolutionIdGet(solutionID)
    solnEx.claimedCapabilityEvidence = solnEx.claimedCapabilityEvidence.concat(evidence)
    await this.solutionsExApi.apiPorcelainSolutionsExUpdatePut({ solnEx })
    return this.solutionForAssessment(solutionID)
  }

  async submitSolutionForCapabilityAssessment (solutionID) {
    const CAP_ASS_STATUS = this.getCapabilityAssessmentStatusCode() // ✨🧙 magic 🧙✨

    const solnEx = await this.solutionsExApi.apiPorcelainSolutionsExBySolutionBySolutionIdGet(solutionID)
    solnEx.solution.status = CAP_ASS_STATUS
    await this.solutionsExApi.apiPorcelainSolutionsExUpdatePut({ solnEx })
    return this.solutionForAssessment(solutionID)
  }

  // As there is no API Endpoint for transitioning a solution from one status to another, other than
  // setting the status of a solution to a different magical number, this method exists so that the
  // status of a solution can be set to the same number whenever a solution is needed to be in
  // Capability Assessment Status
  // I.E. Get the code that says: 'Solution has capability evidence and has been submitted for Assessment'
  getCapabilityAssessmentStatusCode () {
    return '2' // ✨🧙 magic 🧙✨
  }

  getRegisteredStatusCode () {
    return '1' // ✨🧙 magic 🧙✨
  }
}

// export a default, pre-configured instance of the data provider
// as well as the constructor to allow for using testing with a mock API class
class RealDataProvider extends DataProvider {
  constructor () {
    super(require('catalogue-api'))
    this.CatalogueApi.ApiClient.instance.basePath = process.env.API_BASE_URL || 'http://api:5100'
  }

  // support for the authentication layer
  setAuthenticationToken (token) {
    this.CatalogueApi.ApiClient.instance.authentications.oauth2.accessToken = token
  }
}

module.exports = {
  sessionStore,
  dataProvider: new RealDataProvider(),
  DataProvider
}
