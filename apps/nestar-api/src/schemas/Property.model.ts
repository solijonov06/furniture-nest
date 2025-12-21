import { Schema } from 'mongoose';
import { 
	FurnitureCondition, 
	PropertyCategory, 
	PropertyLocation, 
	PropertyMaterial, 
	PropertyStatus, 
	PropertyType 
} from '../libs/enums/property.enum';

const PropertySchema = new Schema(
	{
		propertyType: {
			type: String,
			enum: PropertyType,
			required: true,
		},

		propertyStatus: {
			type: String,
			enum: PropertyStatus,
			default: PropertyStatus.ACTIVE,
		},

		propertyLocation: {
			type: String,
			enum: PropertyLocation,
			required: true,
		},

		propertyAddress: {
			type: String,
			required: true,
		},

		propertyTitle: {
			type: String,
			required: true,
		},

		propertyPrice: {
			type: Number,
			required: true,
		},

		propertyVolume: {
			type: Number,
			required: true,
		},

		propertyMaterial: {
			type: String,
			enum: PropertyMaterial,
			default: PropertyMaterial.WOOD,
		},

		propertyCategory: {
			type: String,
			enum: PropertyCategory,
			default: PropertyCategory.LIVING_ROOM,
		},

		furnitureCondition: {
			type: String,
			enum: FurnitureCondition,
			default: FurnitureCondition.GOOD,
		},

		deliveryAvailable: {
			type: Boolean,
			default: false,
		},

		propertyViews: {
			type: Number,
			default: 0,
		},

		propertyLikes: {
			type: Number,
			default: 0,
		},

		propertyComments: {
			type: Number,
			default: 0,
		},

		propertyRank: {
			type: Number,
			default: 0,
		},

		propertyImages: {
			type: [String],
			required: true,
		},

		propertyDesc: {
			type: String,
		},

		memberId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},

		soldAt: {
			type: Date,
		},

		deletedAt: {
			type: Date,
		},
	},
	{ timestamps: true, collection: 'properties' },
);

PropertySchema.index({ propertyType: 1, propertyLocation: 1, propertyTitle: 1, propertyPrice: 1 }, { unique: true });

export default PropertySchema;
