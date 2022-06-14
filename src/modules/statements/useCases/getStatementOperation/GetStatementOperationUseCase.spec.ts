import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersRepository: IUsersRepository;
let statementsRepository: IStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}

describe("Get Balance", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        statementsRepository = new InMemoryStatementsRepository();
        createUserUseCase = new CreateUserUseCase(usersRepository);
        createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
        getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementsRepository);
    });

    it("should be able to get a statement operation", async () => {
        const user = await createUserUseCase.execute({ name: "Hugh", email: "hugh@email.com", password: "goodpassword" });
        const statement = await createStatementUseCase.execute({
            user_id: user.id as string,
            amount: 5,
            type: OperationType.DEPOSIT,
            description: "saving money"
        });

        const statementOperation = await getStatementOperationUseCase.execute({
            user_id: user.id as string,
            statement_id: statement.id as string
        });

        expect(statementOperation.amount).toEqual(5);
        expect(statementOperation.type).toEqual(OperationType.DEPOSIT);
        expect(statementOperation.description).toEqual("saving money");
    });

    it("should not be able to get a statement operation if the user doesn't exist", () => {
        expect(async () => {
            await getStatementOperationUseCase.execute({
                user_id: "random-user-id",
                statement_id: "statement-id"
            });
        }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
    });

    it("should not be able to get a statement operation if the statement doesn't exist", () => {
        expect(async () => {
            const user = await createUserUseCase.execute({ name: "Hugh", email: "hugh@email.com", password: "goodpassword" });

            await getStatementOperationUseCase.execute({
                user_id: user.id as string,
                statement_id: "statement-id"
            });
        }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
    });
})