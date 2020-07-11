import { Router } from 'express';

import ProfileController from '../controllers/ProfilleController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const profileRouter = Router();

const profileContoller = new ProfileController();

profileRouter.use(ensureAuthenticated);

profileRouter.put('/', profileContoller.update);
profileRouter.get('/', profileContoller.show);

export default profileRouter;
