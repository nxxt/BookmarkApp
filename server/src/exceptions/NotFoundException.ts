import HttpException from "./HttpException";

export default class NotFoundException extends HttpException {
  constructor(itemName: string, id: string) {
    super(404, `${itemName} with id ${id} not found`);
  }
}
