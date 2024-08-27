export const getLibraryContents = async (req, res) => {
    if (!req.query || Object.keys(req.query).length === 0) {
        console.log(' request has some missing query params', req.query);
        return res.status(401).json({message: "invalid query parameters"});
    }
}