function out = pvModel(time, irradiance, temp, pvParams)
% pvModel - Simple PV power model
% Returns PV power output (W)
if nargin < 3, temp = 25; end
if nargin < 2, irradiance = 1000; end
if nargin < 4
    pvParams.Pmax = 5000; % W
    pvParams.Vmp = 250; % V
    pvParams.Imp = 20; % A
    pvParams.noct = 45; % C
    pvParams.tempCoeff = -0.004; % /C
end
% Simple linear temperature/irradiance scaling
Tcell = temp + (pvParams.noct - 20)/800 * irradiance;
PmaxT = pvParams.Pmax * (1 + pvParams.tempCoeff * (Tcell - 25));
out = PmaxT * (irradiance / 1000);
out = max(0, out);
end
