create type Mood as enum ('sad','happy');

create table People (
	name text not null,
	feels Mood
);

insert into People values ('John','happy');
insert into People values ('Andrew','sad');
