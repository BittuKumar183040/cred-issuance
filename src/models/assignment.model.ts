import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("assignments")
export class Assignment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  issued_by!: string;

  @Column("bigint")
  issued_at!: number;

  @Column("bigint")
  updated_at!: number;

  @Column()
  issued_status!: string;
}
