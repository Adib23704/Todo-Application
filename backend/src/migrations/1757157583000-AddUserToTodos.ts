import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class AddUserToTodos1757157583000 implements MigrationInterface {
  name = 'AddUserToTodos1757157583000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add userId column to todos table
    await queryRunner.addColumn(
      'todos',
      new TableColumn({
        name: 'userId',
        type: 'varchar',
        length: '36',
        isNullable: false,
      }),
    );

    // Add foreign key constraint
    await queryRunner.createForeignKey(
      'todos',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    // Add index for better performance
    await queryRunner.createIndex(
      'todos',
      new TableIndex({
        name: 'IDX_TODOS_USER_ID',
        columnNames: ['userId'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop index
    await queryRunner.dropIndex('todos', 'IDX_TODOS_USER_ID');

    // Drop foreign key constraint
    const table = await queryRunner.getTable('todos');
    const foreignKey = table?.foreignKeys.find(
      fk => fk.columnNames.indexOf('userId') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('todos', foreignKey);
    }

    // Drop userId column
    await queryRunner.dropColumn('todos', 'userId');
  }
}
