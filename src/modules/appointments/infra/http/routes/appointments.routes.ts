import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';

const appoinmentsRouter = Router();
const appoinmentsController = new AppointmentsController();

appoinmentsRouter.use(ensureAuthenticated);

appoinmentsRouter.post('/', appoinmentsController.create);

export default appoinmentsRouter;
