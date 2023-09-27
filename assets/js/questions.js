const questions = await fetch("./assets/data/data.json")
    .then(response => response.json())

export default questions;