describe('blog app', () => {
  beforeEach(() => { 
    const user = {
      name:     'test',
      username: 'test',
      password: 'test'
    }
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    cy.request('POST', 'http://localhost:3001/api/users/', user)

    cy.visit('http://localhost:3001/' )
  })

  it('frontend loads', () => {
    cy.contains('Log in to application')
  })


  it('login is loaded', () => {
    cy.get('input[type="text"]').should('exist')
    cy.get('input[type="password"]').should('exist')
  })

  describe("login", () => {
    it('succeeds with correct credentials', () => {
      cy.get('input[type="text"]').type('test')
      cy.get('input[type="password"]').type('test')
      cy.get('button[type="submit"]').click()

      cy.contains('test logged in')
    })


    it('fails with wrong credentials', () => {
      cy.get('input[type="text"]').type('wrong')
      cy.get('input[type="password"]').type('wrong')
      cy.get('button[type="submit"]').click()

      cy.get('.error').should('exist')
    })

  })

  describe('when logged in', () => {

    beforeEach(() => {
      cy.get('input[type="text"]').type('test')
      cy.get('input[type="password"]').type('test')
      cy.get('button[type="submit"]').click()
    })


    it('logout works', () => {
      cy.contains('logout').click()

      cy.contains('Log in to application')
    })


    it('a blog can be created', () => {
      cy.contains('create').click()

      cy.get('#title').type('cypress test :)')
      cy.get('#author').type('cypress author :)')
      cy.get('#url').type('http://www.cypress.com')
      cy.get('button[type="submit"]').click()

      cy.contains('cypress test :) cypress author :)')
    })

    describe("with a blog created by the user", () => {
      beforeEach(() => {
        cy.contains('create').click()

        cy.get('#title').type('cypress test :)')
        cy.get('#author').type('cypress author :)')
        cy.get('#url').type('http://www.cypress.com')
        cy.get('button[type="submit"]').click()
      })

      it('a blog can be liked', () => {
        cy.contains('cypress test :) cypress author :)')
        cy.contains('view').click()
        cy.contains('like').click()
        cy.contains('likes 1')
      })

      it('a blog can be deleted by creator', () => {
        cy.contains('cypress test :) cypress author :)')
        cy.contains('view').click()
        cy.contains('remove').click()

        cy.contains('No blogs to show')
      })
    })


    describe("with a blog not created by the user", () => {
      beforeEach(() => {
        const newBlog = {
          title: 'test2Blog',
          author: 'test2Author',
          url: 'http://www.test2.com'
        }

        cy.request('POST', 'http://localhost:3001/api/testing/create-blog', newBlog)
        cy.reload()
      })

      it('a blog can be liked', () => {
        cy.contains('test2Blog test2Author')
        cy.contains('view').click()
        cy.contains('like').click()
        cy.contains('likes 1')
      })

      it('a blog can\'t be deleted by another user', () => {
        cy.contains('test2Blog test2Author')
        cy.contains('view').click()

        cy.get('remove').should('not.exist')
      })
    })

    describe("with multiple blogs", () => {
      beforeEach(() => {
        cy.request('POST', 'http://localhost:3001/api/testing/create-multiple-blogs')
        cy.reload()  
      })


      it('blogs are ordered in descending order', () => {

        cy.get(".blogs").children().eq(0).should("contain", "Type wars Robert C. Martin")
        cy.get(".blogs").children().eq(1).should("contain", "TDD harms architecture Robert C. Martin")
        cy.get(".blogs").children().eq(2).should("contain", "First class tests Robert C. Martin")
        cy.get(".blogs").children().eq(3).should("contain", "Canonical string reduction Edsger W. Dijkstra")
        cy.get(".blogs").children().eq(4).should("contain", "Go To Statement Considered Harmful Edsger W. Dijkstra")
        cy.get(".blogs").children().eq(5).should("contain", "React patterns Michael Chan")
      })
    })

  })
})
