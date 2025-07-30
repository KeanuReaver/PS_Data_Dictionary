'use strict';
define(function(require) {
    const module = require('components/ucsd_data_dictionary/module');

    module.factory('catFact', [function() {
        // Fact: Cats are indifferent to cat facts.
        const categoryRules = [
            {
                cat: 'Ecollect & Enrollment Express',
                test: n =>
                    n.startsWith('u_fb_')
                    || n.includes('ecollect')
                    || n.includes('u_community_service')
            },
            {
                cat: 'Code Sets',
                test: n =>
                    n.includes('code')
            },
        // These seem logical enough, check for these rules first before the tables get attached to student/staff/guardian groups
            {
                cat: 'Enrollment / Withdrawals',
                test: n =>
                    n.includes('enroll')
                    || n.startsWith('ps_enrollment')
                    || n.startsWith('fte')
            },
            {
                cat: 'Attendance',
                test: n =>
                    n.includes('attendance')
                    || n.includes('adaadm')
                    || n.startsWith('ps_membership')
                    || n.includes('ps_adaadm')
                    || n.startsWith('att_')
                    || n.includes('truanc')
                    || n.includes('unexcused')
                    || n.startsWith('agg_att')
            },
            {
                cat: 'Scheduling',
                test: n =>
                    n.includes('schedule')
                    || n.startsWith('course')
                    || n.startsWith('section')
                    || n === 'cc'
                    || n.startsWith('cc_')
                    || n.startsWith('period')
                    || n.startsWith('term')
                    || n.includes('cycle_day')
                    || n.includes('bell_schedule')
            },
            {
                cat: 'Assessments',
                test: n =>
                    n.startsWith('test')
                    || n.startsWith('studenttest')
            },
            {
                cat: 'Behavior / Incidents',
                test: n =>
                    n.startsWith('incident')
                    || n.startsWith('log')
                    && n !== 'logins'
            },
        // This seems kind of a clusterf*** I might have to revist the 'Academic' categories. They might benefit greatly from another tier
            {
                cat: 'Academics',
                test: n =>
                    n === 'classrank'
                    || n === 'honorroll'
                    || ( n.startsWith('grade') && !n.includes('gradescale') )
            },
            {
                cat: 'Assignments',
                test: n =>
                    n.includes('assignment')
                    || ( n.includes('asmt') && !n.includes('citi') )
            },
            {
                cat: 'Grade Scales',
                test: n =>
                    n.includes('gradescale')
            },
            {
                cat: 'Grades – Standards',
                test: n =>
                    n.includes('standard')
                    || n.includes('std')
            },
            {
                cat: 'Grades – Traditional',
                test: n =>
                    n.startsWith('pg')
                    || ( n.includes('grade') && !n.includes('standard') && !n.includes('std') )
            },
            {
                cat: 'Student Fitness',
                test: n =>
                    n.includes('fitnessscale')
            },
            {
                cat: 'Graduation Plan',
                test: n =>
                    n.startsWith('gp')
                    || n.includes('grad')
            },
        // I'm mostly happy with these categories, though I think fee's technically falls under students and Notifications & Communications is a very ambiguous category
            {
                cat: 'Plugin Management',
                test: n =>
                    n.startsWith('plugin')
            },
            {
                cat: 'Health',
                test: n =>
                    n.startsWith('health')
                    || n.includes('med')
                    || n.includes('immun')
            },
            {
                cat: 'Fees & Finance',
                test: n =>
                    n.startsWith('fee')
                    || n.includes('payment')
                    || n.startsWith('asset')
                    || n.startsWith('gl')
            },
            {
                cat: 'Notifications & Communication',
                test: n =>
                    n.includes('notification')
                    || n.startsWith('message')
                    || n.startsWith('bulletin')
                    || n.includes('scheduledevent')
                    || n.startsWith('email')
            },
            {
                cat: 'State / Reporting',
                test: n =>
                    n.startsWith('state')
                    | n.startsWith('sif_')
                    | n.startsWith('s_')
                    | n.startsWith('pssr_')
                    | n.startsWith('cst_')
            },
            {
                cat: 'Staff',
                test: n =>
                    n === 'users'                 
                    || n === 'teachers'
                    || n === 'schoolstaff'
                    || n.startsWith('teacher')
            },
            {
                cat: 'Students & Demographics',
                test: n =>
                    n.startsWith('student')
                    || n.includes('address')
                    || n.includes('race')
                    || n.includes('ethnicity')
                    || n.includes('demographic')
                    || n === 'transportation'
            },
            {
                cat: 'Student Contact',
                test: n =>
                    n.includes('person')
                    || n.includes('contact')
                    || n.startsWith('guardian')
                    || n === 'relationship'
            },
            {
                cat: 'District / Schools',
                test: n =>
                    n.includes('school')          
                    || n.startsWith('district')      
                    || n.includes('calendar')        
                    || n.includes('bell_schedule')   
                    || n.startsWith('facility')      
                    || n === 'room'
            },
            {
                cat: 'Post Graduation',
                test: n =>
                    n.startsWith('career')
            },
            {
                cat: 'Import/Export',
                test: n =>
                    n.startsWith('data')
                    || n.startsWith('import')
            },
        // If I make another tier, I might split these up into specific plugins and manually created.
            {
                cat: 'Standalone Custom Tables',
                test: n =>
                    n.startsWith('u_')
            },
        // Would have been useful for this project :D maybe useful to someone else!
            {
                cat: 'Database Information',
                test: n =>
                    n.startsWith('extschema')
                    || n.startsWith('dictionary')
            },
        // No idea what some of these prefixes mean either in a functional sense or what they even stand for, or both. I think cst_ is for state stuff, but I don't know if it fits the state category?
            {
                cat: 'System Management',
                test: n =>
                    n.startsWith('access')
                    || n.startsWith('role')
                    || n.includes('fieldlevelsecurity')
                    || n.startsWith('pcas_')
                    || n === 'prefs'
                    || n.startsWith('server_')
                    || n.startsWith('sys_')
                    || n.startsWith('schema')
                    || n.startsWith('db_')
                    || n.endsWith('_queue')
                    || n.startsWith('au_')
                    || n.startsWith('cst_')
            },
            {
                cat: 'General Utilities/Lookup',
                test: n =>
                    n.startsWith('gen')
                    || n.includes('pref')
            }
        ];


        function categorize(raw = '') {
            const n = raw.toLowerCase();
            for (const rule of categoryRules) {
                if (typeof rule.test === 'function' ? rule.test(n) : rule.test.test(n)) {
                    return rule.cat;
                }
            }
            return 'Other / Misc';
        }

        return {
            groupDictionaryData: function(data) {
                const categorized = {};
                const tableLookup = new Map();
                
                // Categorize and build tableLookup
                for (const item of data) {
                    const tableName = item.table_name;
                    const tableKey  = tableName.toUpperCase();
                    const name      = tableName.toLowerCase();
                    
                    const useOwnName = (
                        name.startsWith('u_fb_') ||
                        name.includes('ecollect') ||
                        name.includes('u_community_service') ||
                        !item.core_table ||
                        item.core_table.toUpperCase() === 'INDEPENDENT TABLE'
                    );
                
                    const category = categorize(useOwnName ? tableName : item.core_table);
                    
                    if (!categorized[category]) {
                        categorized[category] = { category, assocTables: {} };
                    }
                    
                    const tables = categorized[category].assocTables;
                    
                    if (!tables[tableKey]) {
                        tables[tableKey] = {
                            table_name: item.table_name,
                            table_title: item.table_title,
                            table_desc: item.table_desc,
                            table_cat: category,
                            fields: [],
                            extended_by: []
                        };
                        tableLookup.set(tableKey, item.table_name);
                    }
                
                    tables[tableKey].fields.push({
                        field_name: item.field_name,
                        field_version: item.field_version,
                        field_data_type: item.field_data_type,
                        field_desc: item.field_desc,
                        is_core: item.is_core,
                        parent_table: item.parent_table,
                        parent_table_index: item.parent_table_index
                    });
                }
                
                for (const cat of Object.values(categorized)) {
                    for (const tblObj of Object.values(cat.assocTables)) {
                        for (const field of tblObj.fields) {
                            const name = field.field_name.toUpperCase();
                            
                            // Check if field references another table
                            if (!field.parent_table || name !== 'ID' || name !== 'DCID') {
                                let base = null;
                                if (name.endsWith('_DCID')) base = name.slice(0, -5);
                                else if (name.endsWith('DCID')) base = name.slice(0, -4);
                                else if (name.endsWith('_ID')) base = name.slice(0, -3);
                                else if (name.endsWith('ID')) base = name.slice(0, -2);
                                
                                if (base && (tableLookup.has(base) || tableLookup.has(base + 'S'))) {
                                    const matched = tableLookup.get(base) || tableLookup.get(base + 'S');
                                    if (matched.toUpperCase() !== tblObj.table_name.toUpperCase()) {
                                        field.parent_table = matched;
                                    }
                                }
                            }
                            
                            // Check if table has any extension tables
                            if (field.parent_table && field.parent_table_index) {
                                for (const parentCat of Object.values(categorized)) {
                                    for (const parentTbl of Object.values(parentCat.assocTables)) {
                                        if (parentTbl.table_name.toUpperCase() === field.parent_table.toUpperCase()) {
                                            parentTbl.extended_by.push(tblObj.table_name);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                
                // Converts to array for categorized output
                return Object.values(categorized).map(cat => ({
                    category: cat.category,
                    assocTables: Object.values(cat.assocTables).sort((a, b) =>
                        a.table_name.localeCompare(b.table_name)
                    )
                }));
            }
        };
    }]);
});