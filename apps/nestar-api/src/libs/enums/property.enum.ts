import { registerEnumType } from '@nestjs/graphql';

export enum PropertyType {
	FURNITURE = 'FURNITURE',
	HOME_DECOR = 'HOME_DECOR',
	HOME_APPLIANCES = 'HOME_APPLIANCES',
}
registerEnumType(PropertyType, {
	name: 'PropertyType',
});

export enum PropertyStatus {
	ACTIVE = 'ACTIVE',
	SOLD = 'SOLD',
	DELETE = 'DELETE',
}
registerEnumType(PropertyStatus, {
	name: 'PropertyStatus',
});

export enum PropertyLocation {
	NEWYORK = 'NEWYORK',
	LOSANGELES = 'LOSANGELES',
	CHICAGO = 'CHICAGO',
	HOUSTON = 'HOUSTON',
	PHONENIX = 'PHONENIX',
	PHILADELPHIA = 'PHILADELPHIA',
	SANANTONIO = 'SANANTONIO',
	SANDIEGO = 'SANDIEGO',
	DALLAS = 'DALLAS',
}
registerEnumType(PropertyLocation, {
	name: 'PropertyLocation',
});
