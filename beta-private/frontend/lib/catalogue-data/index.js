const solutionOnboardingStatusMap = {
  0: { stageName: 'Registration', stageStep: '1 of 4', status: 'Draft' },
  1: { stageName: 'Registration', stageStep: '1 of 4', status: 'Registered' },
  2: { stageName: 'Assessment', stageStep: '2 of 4', status: 'Submitted' },
  3: { stageName: 'Compliance', stageStep: '3 of 4', status: 'In progress' },
  4: { stageName: 'Final Approval', stageStep: '3 of 4', status: 'In progress' },
  5: { stageName: 'Solution Page', stageStep: '4 of 4', status: 'In progress' }
}

class DataProvider {
  constructor (CatalogueApi) {
    this.CatalogueApi = CatalogueApi
    this.contactsApi = new this.CatalogueApi.ContactsApi()
    this.orgsApi = new CatalogueApi.OrganisationsApi()
    this.solutionsApi = new CatalogueApi.SolutionsApi()
  }

  async contactByEmail (email) {
    const contact = await this.contactsApi.apiContactsByEmailByEmailGet(email)
    const org = await this.orgsApi.apiOrganisationsByContactByContactIdGet(contact.id)

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
      displayName: `${soln.name} ${soln.version && `| ${soln.version}`}`,
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
}

// export a default, pre-configured instance of the data provider
// as well as the constructor to allow for using testing with a mock API class
class RealDataProvider extends DataProvider {
  constructor () {
    super(require('catalogue-api'))
    this.CatalogueApi.ApiClient.instance.basePath = 'http://api:5100'
  }

  // support for the authentication layer
  setAuthenticationToken (token) {
    this.CatalogueApi.ApiClient.instance.authentications.oauth2.accessToken = token
  }
}

module.exports = {
  dataProvider: new RealDataProvider(),
  DataProvider
}
