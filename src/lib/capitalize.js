const capitalizeWord = (word) => {
    if (!word) return word;
    return word[0].toUpperCase() + word.substr(1);
}

export default capitalizeWord