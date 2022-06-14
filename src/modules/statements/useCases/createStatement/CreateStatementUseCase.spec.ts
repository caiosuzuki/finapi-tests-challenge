import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let usersRepository: IUsersRepository;
let statementsRepository: IStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

describe("Get Balance", () => {
    beforeEach(()=> {
        usersRepository = new InMemoryUsersRepository();
        statementsRepository = new InMemoryStatementsRepository();
        createUserUseCase = new CreateUserUseCase(usersRepository);
        createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
    });

    it("should be able to create a statement", async () => {
        const user = await createUserUseCase.execute({name: "Hugh", email: "hugh@email.com", password: "goodpassword"});
        const user_id = user.id as string;
        const amount = 100;
        const type = OperationType.DEPOSIT;
        const description = "Salary";
        
        const statement = await createStatementUseCase.execute({
            user_id,
            amount,
            type,
            description
        });

        expect(statement.user_id).toEqual(user_id);
        expect(statement.amount).toEqual(amount);
        expect(statement.type).toEqual(type);
        expect(statement.description).toEqual(description);
    });

    it("should not be able to create a statement if the user doesn't exist", () => {
        expect(async () => {
            await createStatementUseCase.execute({
                user_id: "invalid-user-id",
                amount: 10,
                type: OperationType.WITHDRAW,
                description: "getting ice cream"
            });
        }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
    });

    it("should not be able to create a withdrawal statement if the user doesn't have enough funds", () => {
        expect(async () => {
            const user = await createUserUseCase.execute({name: "Hugh", email: "hugh@email.com", password: "goodpassword"});
            await createStatementUseCase.execute({
                user_id: user.id as string,
                amount: 5,
                type: OperationType.DEPOSIT,
                description: "saving money"
            });

            await createStatementUseCase.execute({
                user_id: user.id as string,
                amount: 10,
                type: OperationType.WITHDRAW,
                description: "getting ice cream"
            });
        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
    });
})