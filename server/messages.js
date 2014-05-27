/**
 *Set of human readable messages to send to the application
 * @type {{notFound: string, badRequest: string, creationSuccess: string, conflict: string, internalError: string, authenticationRequired: string, forbidden: string}}
 */

module.exports = {

    notFound: 'the item could not be found: ',
    badRequest: 'the request is not appropriate',
    creationSuccess: 'the item has been successfully created',
    conflict: 'the item already exist and therefore could not be created',
    internalError: 'the operation could not be completed due to internal server error',
    authenticationRequired: 'user must be authenticated',
    forbidden: 'user is not authorized'

};
