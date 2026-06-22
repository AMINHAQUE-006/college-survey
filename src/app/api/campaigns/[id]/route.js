import { itemHandlers } from "@/lib/resource-route";
import CampaignService from "@/services/CampaignService";
export const { GET, PATCH, DELETE } = itemHandlers(CampaignService);
