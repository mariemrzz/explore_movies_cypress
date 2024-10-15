describe('Test main page of "Explore Movies"', () => {
  beforeEach(() => {
    cy.visit('https://movies.mariemrzz.site/')
  })
  it('Verify main page components are displayed and clickable', () => {
    cy.getDataTestId('appTitleId').should('contains.text', 'Explore Movies')
    cy.getId('genreForm').should('contains.text', 'Choose a genre:')
    cy.getDataTestId('genresId').find(':selected').should('have.text', 'Action')
    cy.getId('playBtn').should('have.text', 'Search')
    cy.getDataTestId('genresId').select('Drama').find(':selected').should('have.text', 'Drama')
  })
})