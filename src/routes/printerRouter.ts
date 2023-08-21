import express from 'express';
import printerCtrl from '../controllers/printerCtrl';

const router = express.Router();


router.get('/list/:ip', printerCtrl.listPrinters);
router.get('/add/:ip/:printerName', printerCtrl.addPrinter);


export default router;