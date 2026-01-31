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
	PHOENIX = 'PHOENIX',
	PHILADELPHIA = 'PHILADELPHIA',
	SANANTONIO = 'SANANTONIO',
	SANDIEGO = 'SANDIEGO',
	DALLAS = 'DALLAS',
}
registerEnumType(PropertyLocation, {
	name: 'PropertyLocation',
});

export enum PropertyMaterial {
	WOOD = 'WOOD',
	METAL = 'METAL',
	FABRIC = 'FABRIC',
	LEATHER = 'LEATHER',
	PLASTIC = 'PLASTIC',
	GLASS = 'GLASS',
}
registerEnumType(PropertyMaterial, {
	name: 'PropertyMaterial',
});

export enum PropertyCategory {
	BEDROOM = 'BEDROOM',
	LIVING_ROOM = 'LIVING_ROOM',
	KITCHEN = 'KITCHEN',
	OFFICE = 'OFFICE',
	OUTDOOR = 'OUTDOOR',
}
registerEnumType(PropertyCategory, {
	name: 'PropertyCategory',
});

export enum FurnitureCondition {
	NEW = 'NEW',
	LIKE_NEW = 'LIKE_NEW',
	GOOD = 'GOOD',
	FAIR = 'FAIR',
	POOR = 'POOR',
}
registerEnumType(FurnitureCondition, {
	name: 'FurnitureCondition',
});
