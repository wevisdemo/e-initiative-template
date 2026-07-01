import dayjs from 'dayjs';
import Config from '../../e-initiative.config.mjs';

export const dayElapsed = Config.petition.endDate
	? -dayjs().diff(Config.petition.endDate, 'days')
	: undefined;

export const isCampaignEnded = Config.petition.endDate
	? dayjs().isAfter(Config.petition.endDate)
	: false;
