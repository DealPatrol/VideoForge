import { Router, type IRouter } from "express";
import healthRouter from "./health";
import dashboardRouter from "./dashboard";
import projectsRouter from "./projects";
import analyzeRouter from "./analyze";
import conceptsRouter from "./concepts";
import scriptRouter from "./script";
import mediaRouter from "./media";
import voiceoverRouter from "./voiceover";
import captionsRouter from "./captions";
import renderRouter from "./render";
import publishRouter from "./publish";
import settingsRouter from "./settings";
import trendsRouter from "./trends";

const router: IRouter = Router();

router.use(healthRouter);
router.use(dashboardRouter);
router.use(projectsRouter);
router.use(analyzeRouter);
router.use(conceptsRouter);
router.use(scriptRouter);
router.use(mediaRouter);
router.use(voiceoverRouter);
router.use(captionsRouter);
router.use(renderRouter);
router.use(publishRouter);
router.use(settingsRouter);
router.use(trendsRouter);

export default router;
