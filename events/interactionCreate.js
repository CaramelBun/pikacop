module.exports = async (client, interaction) => {
    if (!interaction.deferred) {
        await interaction.deferUpdate();
    }
};