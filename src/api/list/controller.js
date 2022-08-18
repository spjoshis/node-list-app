let consumed = [];

/**
 * Validate list and return if list is perfect or not
 * @param {int} index 
 * @param {array} list 
 * @param {int} count 
 * @returns boolean
 */
const validateList = (index, list, count = 1) => {

    /* Check for end of list */
    if (count === list.length) {
        /* return true if last element takes you back to position zero */
        if (list[index] === 0) return true;
        return false;
    }

    /* Check if index exists in array or not */
    if (typeof list[index] === 'undefined' || index in consumed) return false;

    /* Push visited index in array */
    consumed.push(index)

    /* If next index is exists in array then repeate the validation process */
    return validateList(list[index], list, ++count);
}

/**
 * Route handler for '/process-cycle' API
 * @param {object} request
 * @param {object} response
 * @returns object
 */
const processCycle = (request, response) => {
    const lists = request.body;
    
    /* Process each request parameters in validation */
    let resObj = {}
    Object.keys(lists).map((k) => {
        consumed = [];
        resObj[k] = validateList(0, lists[k]);
    });

    return response
        .json(resObj)
        .status(200);
}

export default processCycle;