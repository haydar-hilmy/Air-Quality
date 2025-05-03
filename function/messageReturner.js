const messageReturner = (validity = undefined, message = "Message Returner") => {
    return {
        isValid: validity,
        message: message
    }
}

export { messageReturner }