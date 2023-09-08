import { Router } from 'express';
import deviceCtrl from '../controllers/deviceCtrl';

const router = Router();

// Obtiene datos basado en los filtros especificados
router.get('/data/:month/:area?/:ubicacion?/:tipo?', deviceCtrl.getDeviceData);

// Lista todas las tablas (años)
router.get('/list/tables', deviceCtrl.listTables);

// Lista las áreas para un mes específico
router.get('/list/areas/:month', deviceCtrl.listAreas);

// Lista las ubicaciones para un mes y área específicos
router.get('/list/ubicaciones/:month/:area', deviceCtrl.listUbicaciones);

// Lista los tipos para un mes específico
router.get('/list/tipos/:month', deviceCtrl.listTipos);
router.get('/stats/location', deviceCtrl.calculateStatsByLocation);
router.get('/stats/type', deviceCtrl.calculateStatsByType);
router.get('/stats/area', deviceCtrl.calculateStatsByArea);

export default router;
