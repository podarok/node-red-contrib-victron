# User Guide for Victron Energy Nodes

## Overview
The Victron Energy nodes for Node-RED provide an intuitive interface for interacting with your Victron system. These nodes allow you to monitor and control various Victron devices through Node-RED's visual programming interface.

## Available Nodes

![Available nodes](images/node-palette.png)

### Input Nodes
Input nodes allow you to read data from your Victron devices.

![Input node - Edit panel](images/edit-vebus-input.png)

#### Configuration Options
- **Device Select**: Choose from available Victron devices
- **Measurement Select**: Choose what to measure from the selected device
- **Node Label**: Optional custom name for the node

The measurement unit appears in brackets (e.g., "Battery voltage (V)"). For enumerated values, you'll see a legend below the selection.

### Output Nodes
Output nodes let you control Victron devices.

![Output node - Edit panel](images/edit-relay-output.png)

#### Configuration Options
- **Device Select**: Choose which device to control
- **Measurement Select**: Available control options for the device
- **Initial Value**: Value to set when Node-RED starts
- **Node Label**: Optional custom name for the node


### Virtual Devices
Virtual devices create simulated Victron devices on the system.

At the moment there are 4 different virtual devices available:
- Grid meter
- Meteo
- Tank sensor
- Temperature sensor

#### Virtual Device Usage
1. Add a virtual device node to your flow
2. Configure the device type and parameters
3. Deploy the flow
4. Use standard input/output nodes to interact with the virtual device

## Best Practices

1. **Node Naming**
   - Use clear, descriptive names for nodes
   - Include the measurement type in the name
   - Consider adding the device identifier for multiple similar devices

2. **Flow Organization**
   - Group related nodes together
   - Use link nodes for complex flows
   - Add comment nodes to explain logic

3. **Error Handling**
   - Add catch nodes for error handling
   - Validate data before sending to output nodes
   - Consider adding status nodes for monitoring

4. **Performance**
   - Avoid polling too frequently
   - Use triggers for state changes
   - Consider using the context store for frequently accessed values

## Troubleshooting

### Common Issues

1. **Nodes show "not connected"**
   - Check D-Bus connection
   - Verify device is powered on
   - Confirm network connectivity

2. **Values not updating**
   - Check node configuration
   - Verify measurement selection
   - Confirm device is sending data

3. **Cannot write to device**
   - Verify write permissions
   - Check device lock status
   - Confirm value format is correct

### Getting Help
If you encounter issues:
1. Check the debug tab in Node-RED
2. Review the Venus OS logs
3. Visit the [Victron Community Forum](https://community.victronenergy.com)
4. Submit an issue on GitHub

## Additional Resources

- [Example Flows](https://github.com/victronenergy/node-red-contrib-victron/wiki/Example-Flows)
- [API Documentation](./API.md)
- [Installation Guide](./INSTALL.md)
- [Venus OS Documentation](https://www.victronenergy.com/live/venus-os:large)