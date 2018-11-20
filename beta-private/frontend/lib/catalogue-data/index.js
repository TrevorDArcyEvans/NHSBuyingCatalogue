const _ = require('lodash')

const solutionOnboardingStatusMap = {
  0: { stageName: 'Registration', stageStep: '1 of 4', status: 'Draft' },
  1: { stageName: 'Registration', stageStep: '1 of 4', status: 'Registered' },
  2: { stageName: 'Assessment', stageStep: '2 of 4', status: 'Submitted' },
  3: { stageName: 'Compliance', stageStep: '3 of 4', status: 'In progress' },
  4: { stageName: 'Final Approval', stageStep: '3 of 4', status: 'In progress' },
  5: { stageName: 'Solution Page', stageStep: '4 of 4', status: 'In progress' }
}

const EMPTY_UUID = '00000000-0000-0000-0000-000000000000'

const isOverarchingStandard = std => _.startsWith(std.standardId || std.id, 'STD-O-')

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

class DataProvider {
  constructor (CatalogueApi) {
    this.CatalogueApi = CatalogueApi
    this.contactsApi = new this.CatalogueApi.ContactsApi()
    this.orgsApi = new CatalogueApi.OrganisationsApi()
    this.solutionsApi = new CatalogueApi.SolutionsApi()
    this.solutionsExApi = new CatalogueApi.SolutionsExApi()
    this.capabilityMappingsApi = new CatalogueApi.CapabilityMappingsApi()
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

  async solutionsForSupplierDashboard (supplierOrgId, solutionMapper = x => x) {
    const isLive = (soln) => +soln.status === 6 /* Solutions.StatusEnum.Approved */
    const isOnboarding = (soln) => +soln.status !== 6 /* Solutions.StatusEnum.Approved */ &&
      +soln.status !== -1 /* Solutions.StatusEnum.Failed */

    const forDashboard = (soln) => ({
      raw: soln,
      id: soln.id,
      displayName: `${soln.name}${soln.version ? ` | ${soln.version}` : ''}`,
      notifications: []
    })

    const forOnboarding = (soln) => ({
      ...soln,
      ...solutionOnboardingStatusMap[+soln.raw.status]
    })

    const forLive = (soln) => ({
      ...soln,
      status: 'Accepting call-offs',
      contractCount: 0
    })

    const paginatedSolutions = await this.solutionsApi.apiSolutionsByOrganisationByOrganisationIdGet(
      supplierOrgId,
      { pageSize: 9999 }
    )

    return {
      onboarding: paginatedSolutions.items.filter(isOnboarding).map(forDashboard).map(forOnboarding).map(solutionMapper),
      live: paginatedSolutions.items.filter(isLive).map(forDashboard).map(forLive).map(solutionMapper)
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
      })
    }
  }

  async updateSolutionForRegistration (solution) {
    const solnEx = await this.solutionsExApi.apiPorcelainSolutionsExBySolutionBySolutionIdGet(solution.id)

    // reformat the input back into a SolutionEx
    _.merge(solnEx.solution, _.omit(solution, ['capabilities', 'standards', 'contacts']))
    solnEx.claimedCapability = solution.capabilities
    solnEx.claimedStandard = solution.standards
    solnEx.technicalContact = solution.contacts

    // contacts can only be for this solution
    // new contacts need a dummy ID
    _.each(solnEx.technicalContact, c => {
      c.solutionId = solnEx.solution.id
      if (!c.id) {
        c.id = require('node-uuid-generator').generate()
      }
    })

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
                _.partition(capStds, isOverarchingStandard)
              )
            }
          })
          .keyBy('id')
          .value(),
        standards
      }
    })
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
