import type { SimulatorComponent } from './shared';
import { DilutionSim } from './dilution';
import { PrePostSim } from './pre-post-money';
import { OwnershipSim } from './ownership';
import { WaterfallSim } from './waterfall';
import { FundReturnsSim } from './fund-returns';
import { FundraisingSim } from './fundraising-scenario';
import { ManagementFeesSim } from './management-fees';
import { PowerLawSim } from './power-law';
import { SecondariesSim } from './secondaries';
import { InvestmentMemoSim } from './investment-memo';

export const SIMULATOR_COMPONENTS: Record<string, SimulatorComponent> = {
  dilution: DilutionSim,
  'pre-post-money': PrePostSim,
  ownership: OwnershipSim,
  waterfall: WaterfallSim,
  'fund-returns': FundReturnsSim,
  'fundraising-scenario': FundraisingSim,
  'management-fees': ManagementFeesSim,
  'power-law': PowerLawSim,
  secondaries: SecondariesSim,
  'investment-memo': InvestmentMemoSim,
};

export type { SimulatorComponent } from './shared';
