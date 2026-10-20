function [soc, p_batt] = batteryModel(soc0, powerCmd, dt, battParams)
% batteryModel - Simple battery model with SOC
% powerCmd: positive = charge, negative = discharge (W)
% soc: 0-1
if nargin < 3, dt = 1; end
if nargin < 4
    battParams.capacityWh = 20000; % Wh
    battParams.eff = 0.95; % round trip approx
    battParams.socMin = 0.2;
    battParams.socMax = 0.9;
    battParams.vNom = 400;
end
eff = battParams.eff;
cap = battParams.capacityWh;
soc = soc0;
p_batt_eff = powerCmd;
% Enforce limits using initial SOC
if p_batt_eff > 0 && soc >= battParams.socMax - 1e-6
    p_batt_eff = 0;
elseif p_batt_eff < 0 && soc <= battParams.socMin + 1e-6
    p_batt_eff = 0;
end
if p_batt_eff > 0 % charge
    energyIn = p_batt_eff * eff * dt / 3600; % Wh
    soc_new = soc + energyIn / cap;
else
    energyOut = abs(p_batt_eff) / eff * dt / 3600; % Wh
    soc_new = soc - energyOut / cap;
end
if soc_new > battParams.socMax
    soc_new = battParams.socMax;
elseif soc_new < battParams.socMin
    soc_new = battParams.socMin;
end
p_batt = p_batt_eff;
soc = soc_new;
end
