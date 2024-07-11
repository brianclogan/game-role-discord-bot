'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20240407200219 extends Migration {

  async up() {
    this.addSql('create table `games` (`id` int unsigned not null auto_increment primary key, `name` varchar(255) not null, `role_id` text default null, `created_at` datetime not null, `updated_at` datetime not null);');
  }

}
exports.Migration20240407200211 = Migration20240407200219;
