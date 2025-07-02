/* 
####### NOTE #######
This entity is not used anywhere in the project,
it is used only to demonstrate the types of entity relationships
In real projects, it is recommended to save each entity 
in the `src/modules/MODULE_NAME/entities` folder for better organization.
*/
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('baskets')
export class BasketEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  userId: number

  /*
  ####### NOTE #######
  OneToOne relationship between the current entity and the UserEntity
  */
  // @OneToOne(() => UserEntity, (user) => user.basket)
  // @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  // user: UserEntity
}
