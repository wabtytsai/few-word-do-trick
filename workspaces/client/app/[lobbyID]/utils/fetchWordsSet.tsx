export default async function fetchWordsSet() {
    const res = await fetch(
        "https://xrlnrjb1de.execute-api.us-west-2.amazonaws.com/prod/fetchwordsset"
        );
    if (!res.ok) {
        throw new Error('failed to fetch new words');
    }
    return res.json();
}