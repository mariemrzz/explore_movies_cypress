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
      // Expect a film title and release date to be displayed 
      cy.wait('@searchBySpecificGenre').its('response.body').then((body) => {
        let film = body.results.find((item) => {
          return (item.title + ` (${item.release_date.slice(0, 4)})`) == title.text()
        })
        // Expect a genre to match the selected genre
        cy.getDataTestId('genresId').find(':selected').invoke('val')
          .should((value) => expect(film.genre_ids).include(Number(value)))
      })
    })
    // Expect a film poster to be displayed
    cy.getId('moviePoster').find('img').should('have.attr', 'src').should('include', 'https://image.tmdb.org/')
    // Expect imdb rating to be displayed
    cy.contains('span', /^(10(?:\.0+)?|[0-9](?:\.\d+)?)$/i).should('exist')
    // Expect a film description to be displayed 
    cy.getDataTestId('movieOverviewId').find('p').should('contains.text', 'Description')
    // Expect like / dislike buttons to be displayed
    cy.getId('likeBtn').should('have.text', '👍')
    cy.getId('dislikeBtn').should('have.text', '👎')
  })
})