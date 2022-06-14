import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepository: IUsersRepository;

describe("Create user", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(usersRepository);
    })

    it("should be able to create a user", async () => {
        const name = "Johnny";
        const email = "johnny@email.com";
        const password = "johnnyspassword123";

        const user = await createUserUseCase.execute({name, email, password});

        expect(user.name).toEqual(name);
        expect(user.email).toEqual(email);
    })

    it("should be able to create a user", async () => {
        expect(async () => {
            const name = "Johnny";
            const email = "johnny@email.com";
            const password = "johnnyspassword123";
    
            await createUserUseCase.execute({name, email, password});
            await createUserUseCase.execute({name, email, password});
        }).rejects.toBeInstanceOf(CreateUserError);
    })
})