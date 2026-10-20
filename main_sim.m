% SmartMicrogridAI - Main Simulation Script (MATLAB R2022b)
% Runs solar + battery + grid + load + protection

clear; close all; clc;

% Add src to path
addpath('src');

%% Parameters
dt = 1; % seconds (small for demo)
T_sim = 24*3600; % 24 hours
t = 0:dt:(T_sim-dt);
N = length(t);

% Solar
irradiance = 1000 * max(0, sin(2*pi*t/(24*3600)))'; % daily profile
temp = 25 * ones(N,1);
pvParams.Pmax = 5000;
pvParams.noct = 45; pvParams.tempCoeff = -0.004;
P_pv = zeros(N,1);
for i=1:N
    P_pv(i) = pvModel(t(i), irradiance(i), temp(i), pvParams);
end

% Load
P_load_base = 3000; % W
P_load = P_load_base * (1 + 0.3*sin(2*pi*(t+6*3600)/(24*3600)))'; % variable
% Add disturbance
for i=1:N
    if t(i) > 12*3600 && t(i) < 13*3600
        P_load(i) = P_load(i) + 2500; % overload
    end
end
P_load_served = P_load;

% Battery
batt.socMax=0.9; batt.socMin=0.2; batt.capacityWh=20000; batt.eff=0.95;
soc = zeros(N,1); soc(1)=0.5;
P_batt = zeros(N,1);

% Grid
grid.connected = true;
grid.power = zeros(N,1); % positive = importing, negative = exporting (convention)
P_grid = zeros(N,1);
outageStart = 10*3600;
outageEnd = 14*3600;

% Protection
shed = false(N,1);
shedCount = 0;

%% Simulation
for i=1:N
    if i==1, soc_cur = soc(1); else soc_cur = soc(i-1); end
    % Simulate grid outage in window
    if t(i) >= outageStart && t(i) <= outageEnd
        grid.connected = false;
    else
        grid.connected = true;
    end
    P_load_served(i) = P_load(i);
    
    % Net power before control (based on served load)
    P_net = P_pv(i) - P_load_served(i); % + surplus, - deficit
    
    % Control logic
    if grid.connected
        % Grid connected: prioritize self-consumption, charge with surplus, discharge for deficit
        if P_net >= 0
            % Surplus: charge battery if not full, else export to grid
            P_batt_cmd = min(P_net, 2000); % limit charge rate
            [soc_cur_new, P_batt_act] = batteryModel(soc_cur, P_batt_cmd, dt, batt);
            P_batt(i) = P_batt_act;
            soc(i) = soc_cur_new;
            grid_export = (P_net - P_batt(i));
            P_grid(i) = -grid_export; % negative = export
        else
            % Deficit: discharge battery if available, else import from grid
            deficit = abs(P_net);
            P_batt_cmd = -min(deficit, 2500);
            [soc_cur_new, P_batt_act] = batteryModel(soc_cur, P_batt_cmd, dt, batt);
            P_batt(i) = P_batt_act;
            soc(i) = soc_cur_new;
            grid_import = deficit - abs(P_batt(i));
            P_grid(i) = grid_import; % positive = import
        end
        % Overload detection in grid connected with actual curtailment
        if P_grid(i) > 3800 % threshold
            shed(i)=true;
            shedCount = shedCount + 1;
            % Curtail load to available supply
            available = P_pv(i) + abs(P_batt(i)) + P_grid(i);
            if available < P_load_served(i)
                P_load_served(i) = max(0, available);
            else
                P_load_served(i) = P_load(i);
            end
            if P_load_served(i) < P_load(i) - 1e-3
                shed(i)=true;
            end
            P_net = P_pv(i) - P_load_served(i);
        else
            P_load_served(i) = P_load(i);
        end
    else
        % Grid outage: islanded mode
        if P_net >= 0
            P_batt_cmd = min(P_net, 2000);
            [soc_cur_new, P_batt_act] = batteryModel(soc_cur, P_batt_cmd, dt, batt);
            P_batt(i) = P_batt_act; soc(i)=soc_cur_new;
            P_grid(i)=0;
        else
            deficit = abs(P_net);
            P_batt_cmd = -min(deficit, 2500);
            [soc_cur_new, P_batt_act] = batteryModel(soc_cur, P_batt_cmd, dt, batt);
            P_batt(i)=P_batt_act; soc(i)=soc_cur_new;
            P_grid(i)=0;
            % If still deficit, protection: load shedding
            if (deficit - abs(P_batt(i))) > 1e-1
                shed(i)=true; shedCount=shedCount+1;
                % Curtail load to available
                P_load_served(i) = max(0, P_pv(i) + abs(P_batt(i)));
            else
                shed(i)=false;
            end
        end
    end
end

%% Plotting
figure('Name','SmartMicrogridAI Results');
subplot(5,1,1);
plot(t/3600, P_pv/1000,'g-','LineWidth',1.5); ylabel('PV (kW)'); grid on; title('SmartMicrogridAI');
subplot(5,1,2);
plot(t/3600, P_load/1000,'r-','LineWidth',1.5); hold on;
plot(t/3600, P_load_served/1000,'r:','LineWidth',1.5);
plot(t/3600, (P_pv - P_batt + P_grid)/1000,'b--'); ylabel('Load/Power (kW)'); grid on; legend('Load (req)','Load (served)','Supply','Location','best');
subplot(5,1,3);
plot(t/3600, soc*100,'m-','LineWidth',1.5); ylabel('SOC (%)'); grid on; ylim([0 100]);
subplot(5,1,4);
plot(t/3600, P_grid/1000,'k-','LineWidth',1.5); ylabel('Grid (kW)'); grid on; 
subplot(5,1,5);
stairs(t/3600, double(shed),'c-','LineWidth',1.5); ylabel('Shed (on/off)'); xlabel('Time (h)'); grid on;
sgtitle('Solar PV, Load, Battery SOC, Grid Power, Protection Status');

%% Verification checks
soc_ok = all(soc >= batt.socMin-1e-6 & soc <= batt.socMax+1e-6);
shed_occurred = any(shed);
outage_occurred = any(t>=outageStart & t<=outageEnd);
% Power balance check (approximate)
balance_err = max(abs(P_pv - P_batt + P_grid - P_load_served));
fprintf('Simulation complete. Shed events: %d\n', sum(shed));
fprintf('Verification: SOC in limits=%d, shed occurred=%d, outage window present=%d, max balance error=%g W\n', soc_ok, shed_occurred, outage_occurred, balance_err);
