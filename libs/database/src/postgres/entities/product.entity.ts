/* 
####### NOTE #######
This entity is not used anywhere in the project,
it is used only to demonstrate the types of entity relationships
In real projects, it is recommended to save each entity 
in the `src/modules/MODULE_NAME/entities` folder for better organization.
*/
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  createdBy: number

  @Column()
  name: string

  @Column()
  category: string

  @Column()
  price: number

  @Column()
  description: string

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date

  /*
  ####### NOTE #######
  ManyToOne relationship between the current entity and the UserEntity
  */
  // @ManyToOne(() => UserEntity, (user) => user.products, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'createdBy' })
  // creator: UserEntity
}
