describe('Test movie page', () => {
  beforeEach(() => {
    cy.visit('https://movies.mariemrzz.site/')
    cy.getDataTestId('genresId').select('Fantasy')
  })
  it('Verify a film is found by the selected genre and contains all necessary elements', () => {
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
    cy.getId('moviePoster').find('img').should('have.attr', 'src').should('include','https://image.tmdb.org/')
    cy.contains('span', /^(10(?:\.0+)?|[0-9](?:\.\d+)?)$/i).should('exist')
    cy.getDataTestId('movieOverviewId').find('p').should('contains.text', 'Description')
    cy.getId('likeBtn').should('have.text', '👍')
    cy.getId('dislikeBtn').should('have.text', '👎')
  })
})