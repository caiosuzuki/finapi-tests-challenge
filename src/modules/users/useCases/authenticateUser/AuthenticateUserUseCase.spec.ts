import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let usersRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate User", () => {
    beforeEach(()=> {
        usersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(usersRepository);
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
    });

    it("should be able to authenticate a user", async () => {
        const email = "user@email.com";
        const name = "Johnny";
        const password = "superstrongpassword321";
        await createUserUseCase.execute({
            name, email, password
        });

        const authenticationInfo = await authenticateUserUseCase.execute({email, password});

        expect(authenticationInfo.user.email).toEqual(email);
        expect(authenticationInfo.user.name).toEqual(name);
        expect(authenticationInfo).toHaveProperty("token");
    });

    it("should not be able to authenticate a user with wrong email", () => {
        expect(async () => {
            const email = "user@email.com";
            const name = "Johnny";
            const password = "superstrongpassword321";
            await createUserUseCase.execute({
                name, email, password
            });
    
            await authenticateUserUseCase.execute({email: email + ".br", password});
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });

    it("should not be able to authenticate a user with wrong email", () => {
        expect(async () => {
            const email = "user@email.com";
            const name = "Johnny";
            const password = "superstrongpassword321";
            await createUserUseCase.execute({
                name, email, password
            });
    
            await authenticateUserUseCase.execute({email, password: "wrongpassword"});
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });
})