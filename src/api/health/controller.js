
 const healthCheck = (request, response) => {
    return response
        .send( {'status': 'success', 'message': 'Health check...'})
        .status(200);;
}

export default healthCheck;