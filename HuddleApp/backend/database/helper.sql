create type Mood as enum ('sad','happy');

create table if not exists People2 (
	id integer,
	is_active boolean,
	name text not null,
	feels Mood
);

insert into People values ('1','John','happy');
insert into People values ('2','Andrew','sad');

update customer
set profile_picture = coalesce('', profile_picture)
where email = 'Dancer@gmail.com';

-- Find all events a customer has attended
select event.id 
from event
join bookings on event.id = bookings.event
where bookings.customer = <customer.id>