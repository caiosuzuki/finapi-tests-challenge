import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Authenticate User", () => {
    beforeEach(()=> {
        usersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(usersRepository);
        showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
    });

    it("should be able to authenticate a user", async () => {
        const email = "user@email.com";
        const name = "Johnny";
        const password = "superstrongpassword321";
        const user = await createUserUseCase.execute({
            name, email, password
        });
        const userId = user.id as string;

        const userProfile = await showUserProfileUseCase.execute(userId);

        expect(userProfile.name).toEqual(name);
    });

    it("should not be able to show user profile that doesnt exist", () => {
        expect(async () => {
            await showUserProfileUseCase.execute("random-id");
        }).rejects.toBeInstanceOf(ShowUserProfileError);
    });
})