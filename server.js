import server from './src/app.js';
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`);
});