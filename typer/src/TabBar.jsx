function TabBar({tabs, activeTab, onTabChange}) {
    return (
        <div className="tab-bar">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    className={'tab-btn' + (tab.id === activeTab ? ' tab-btn--active' : '')}
                    data-tab={tab.id}
                    onClick={() => onTabChange(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    )
}

export default TabBar
