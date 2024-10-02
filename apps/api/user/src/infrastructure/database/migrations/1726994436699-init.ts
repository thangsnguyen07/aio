import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1726994436699 implements MigrationInterface {
    name = 'Init1726994436699'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "user_account" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "username" character varying NOT NULL,
                "email" character varying,
                "password" character varying NOT NULL,
                "is_verified" boolean NOT NULL DEFAULT false,
                "is_active" boolean NOT NULL DEFAULT true,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "version" integer NOT NULL,
                CONSTRAINT "UQ_3c4d4fae641bf9048ad324ee0d9" UNIQUE ("username"),
                CONSTRAINT "UQ_56a0e4bcec2b5411beafa47ffa5" UNIQUE ("email"),
                CONSTRAINT "PK_6acfec7285fdf9f463462de3e9f" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "user_token" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_id" uuid NOT NULL,
                "refresh_token" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "version" integer NOT NULL,
                CONSTRAINT "UQ_79ac751931054ef450a2ee47778" UNIQUE ("user_id"),
                CONSTRAINT "REL_79ac751931054ef450a2ee4777" UNIQUE ("user_id"),
                CONSTRAINT "PK_48cb6b5c20faa63157b3c1baf7f" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "user_token"
            ADD CONSTRAINT "FK_79ac751931054ef450a2ee47778" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_token" DROP CONSTRAINT "FK_79ac751931054ef450a2ee47778"
        `);
        await queryRunner.query(`
            DROP TABLE "user_token"
        `);
        await queryRunner.query(`
            DROP TABLE "user_account"
        `);
    }

}
