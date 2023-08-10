import { MigrationInterface, QueryRunner, Table } from "typeorm";

const PROFILES_TABLES: Table = new Table({
    name: "profiles",
    columns: [
        {
            name: "username",
            type: "varchar",
            isPrimary: true,
            isNullable: false,
            isUnique: true
        }, {
            name: "email",
            type: "varchar",
            isNullable: false,
            isUnique: true
        }, {
            name: "password",
            type: "varchar",
            isNullable: false
        }, {
            name: "is_email_verified",
            type: "boolean",
            default: false,
            isNullable: false
        }, {
            name: "profile_picture_path",
            type: "varchar",
            isNullable: true,
            default: null
        }, {
            name: "account_type",
            type: "varchar",
            isNullable: false
        }
    ]
});

/**
 * @class UsersInitialization1667924495954
 * @brief Initialization of the profiles table
 *        Creation of the table in the database.
 */
export class UsersInitialization1667924495954 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // users
        await queryRunner.createTable(PROFILES_TABLES, true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // users
        await queryRunner.dropTable(PROFILES_TABLES, true);
    }
}
