import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let usersRepository: IUsersRepository;
let statementsRepository: IStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

describe("Get Balance", () => {
    beforeEach(()=> {
        usersRepository = new InMemoryUsersRepository();
        statementsRepository = new InMemoryStatementsRepository();
        createUserUseCase = new CreateUserUseCase(usersRepository);
        getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository);
    });

    it("should be able to get a user's balance", async () => {
        const user = await createUserUseCase.execute({name: "Hugh", email: "hugh@email.com", password: "goodpassword"});
        await statementsRepository.create({
            user_id: user.id as string, 
            amount: 50,
            type: OperationType.DEPOSIT,
            description: "Got money"
        });
        
        const response = await getBalanceUseCase.execute({user_id: user.id as string});

        expect(response.balance).toEqual(50);
        expect(response.statement).toHaveLength(1);
    });

    it("should not be able to get a user's balance if the user doesn't exist", () => {
        expect(async () => {
            await getBalanceUseCase.execute({user_id: "invalid-user-id"});
        }).rejects.toBeInstanceOf(GetBalanceError);
    });
})