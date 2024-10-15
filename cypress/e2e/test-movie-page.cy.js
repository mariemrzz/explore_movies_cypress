describe('Test movie page', () => {
  beforeEach(() => {
    cy.visit('https://movies.mariemrzz.site/')
    cy.getDataTestId('genresId').select('Fantasy')
  })
  it('Verify a film is found by the selected genre, also check all films elements', () => {
    cy.intercept({
      'method': 'GET',
      'url': 'https://api-movies.mariemrzz.site/3/discover/movie?with_genres=*'
    }).as('searchBySpecificGenre')

    cy.getDataTestId('movieTitleId').find('h1').then((title) => {
      cy.wait('@searchBySpecificGenre').its('response.body').then((body) => {
        let film = body.results.find((item) => {
          return (item.title + ` (${item.release_date.slice(0, 4)})`) == title.text()
        })
        cy.getDataTestId('genresId').find(':selected').invoke('val')
          .should((value) => expect(film.genre_ids).include(Number(value)))
      })
    })
  })
})