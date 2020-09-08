import { Router } from 'express';

export default abstract class Controller {
  public router: Router;

  constructor(router: Router) {
    this.router = router;

    this.initRoutes();
  }

  protected abstract initRoutes(): void;
}
