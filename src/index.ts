import { CONFIG } from "./config/config";
import * as dotenv from "dotenv";
dotenv.config();

import app from "./app";

//Server
app.listen(CONFIG.PORT, () => {
  console.log(`Server runnig on port ${CONFIG.PORT}`);
});
