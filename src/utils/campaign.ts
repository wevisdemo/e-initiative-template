import dayjs from 'dayjs';
import Config from '../../e-initiative.config.mjs';

export const dayElapsed = -dayjs().diff(Config.petition.endDate, 'days');
export const isCampaignEnded = dayElapsed < 0;
